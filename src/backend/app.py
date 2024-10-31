"""
The backend of the website. This consists of all the API calls for user management and connections to the core recommendation algorithm.
"""

from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import json
import csv
import sys, string
from datetime import datetime

sys.path.append("../")
from core_algo import recommend_by_all_genres, core_algo, search_year, sort_year

def find_in_list(title, listp):
    T1_list = [s.lower().translate(str.maketrans('','',string.punctuation)) for s in title.split()]
    for item in listp:
        l = len(item)
        title = item[0:l - 6].strip()
        year = item[l - 5: l - 1].strip()
        if not year.isdigit():
            year = "3000"

        cond = True
        T2 = title.split("(")[0].strip().lower().translate(str.maketrans('','',string.punctuation))
        T2_list = T2.split()
        for i in range(len(T2_list)):
            cond = cond and (T2_list[i] in T1_list[i])
        
        if cond:
            return item
        
def translate_local(title):
    with open("../../data/movies.csv", encoding='utf-8') as file:
        csvd = csv.DictReader(file)
        titles_here = []
        for row in csvd:
            titles_here.append(row["title"])
        
        return find_in_list(title, titles_here)

# initial app setup
app = Flask(__name__)
app.debug = False
app.secret_key = "secret key"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
CORS(app, supports_credentials=True)

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)


# database schema setup

class User(UserMixin, db.Model):
    """
    User ORM class
    :param id: User ID. Primary key of the table.
    :param username: Username of the user.
    :param password_hash: User password hash.
    :param newuser: Stores whether the user is new or not.
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200))
    newuser = db.Column(db.Integer, default=1)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Recommendation(db.Model):
    """
    Recommendation ORM class
    :param id: Movie Recommendation ID
    :param user_id: ID of the user it was recommended to
    :param movie_title: The title of the movie
    :param watched: Whether or not the user has watched the movie
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    movie_title = db.Column(db.String(200), nullable=False)
    recommended_on = db.Column(db.DateTime, default=datetime.utcnow)
    watched = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<Recommendation {self.movie_title}>'

# user management

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route("/login", methods=["GET","POST"])
def login():
    """
    API Call for user login 
    :param endpoint /login:
    :param request body: {"username" : <username>, "password" : <password>}
    """
    err = None
    print(current_user.is_authenticated)
    if current_user.is_authenticated:
        return jsonify({"code" : 201, "redirect_url_key" : "HOME"})
        # redirect to landing page
        
    else:
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()  # 'user' is now defined here
        errcode = 200
        err = ''
        redir_key = "HOME"
        print(username)
        print(password)
        if user is None:
            redir_key = "REGISTER"
            errcode = 400
            err = 'Invalid username. please register.'
        elif not user.check_password(password):
            redir_key = "LOGIN"
            errcode = 401
            err = 'Invalid password. please check your password.'
        else:
            login_user(user)
            if (user.newuser):
                redir_key = "PREFS"
        return jsonify({"code" : errcode, "redirect_url_key" : redir_key, "errstring" : err})

@app.route('/logout')
@login_required
def logout():
    """
    API Call for user logout 
    :param endpoint /logout:
    
    """
    logout_user()
    resp = make_response("", 200)
    return resp

    # return jsonify({"code" : 200, "redirect_url_key" : "LOGIN"})

@app.route('/register', methods=['GET', 'POST'])
def register():
    """
    API Call for user register 
    :param Endpoint /register:
    :param Request Body: {"username" : <username>, "password" : <password>}
    """
    if current_user.is_authenticated:
        return jsonify({"code" : 201, "redirect_url_key" : "HOME"})
    else:
        if request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')
            if (len(User.query.filter_by(username = username).all()) == 0):
                user = User(username=username)
                user.set_password(password)
                db.session.add(user)
                db.session.commit()
                return jsonify({"code" : 200, "redirect_url_key" : "LOGIN"})
            else:
                return jsonify({"code" : 400, "redirect_url_key" : "REGISTER"})
            
# backend modification and querying api calls

@app.route("/registeruserprefs")
def registeruserprefs():
    genrelist = json.loads(request.data)['genre_list']
    movielist = []
    #  Run genre based recommendation algorithm
    movielist = recommend_by_all_genres(genrelist, "../../data/movies.csv")
    for movie in movielist:
        rec = Recommendation(user_id = current_user.id, movie_title = movie[0])
        db.session.add(rec)
        db.session.commit()
    recmovies = [t[1][0] for t in movielist]
    return jsonify({"movie_list" : recmovies})

def raw_getmovielist():
    if (current_user.newuser):
        all_watched_movies = [mov.movie_title for mov in Recommendation.query\
                                .filter_by(user_id=current_user.id)\
                                .all()][0:10]
    else:
        all_watched_movies = [mov.movie_title for mov in Recommendation.query\
                                .filter_by(user_id=current_user.id)\
                                .filter_by(watched=1).all()]
    
    recommended_movies = []
    #  Run movie based recommendation algorithm
    recommended_movies = core_algo(all_watched_movies, "../../data/movies.csv")
    recmovies = [t[1][0] for t in recommended_movies]
    return {"movie_list" : recmovies}

# get recommended movie list based on history
@app.route("/getmovielist")
def getmovielist():
    return jsonify(raw_getmovielist())
    

@app.route("/updatehistory")
def watchmovie():
    if (current_user.newuser):
        User.query.filter_by(id=current_user.id).update({"newuser" : 0})
    
    moviename_other= json.loads(request.data)["movie_title"]
    moviename = translate_local(moviename_other, "../../data/movies.csv")
    Recommendation.query.filter_by(user_id = current_user.id)\
                        .filter_by(movie_title = moviename)\
                        .update({"watched" : 1})
    db.session.commit()
    resp = make_response("", 200)
    return resp

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(port=5000, debug=True)
