from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import json
import sys
from datetime import datetime

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
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200))
    newuser = db.Column(db.Integer, default=1)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Recommendation(db.Model):
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
    logout_user()
    # return jsonify({"code" : 200, "redirect_url_key" : "LOGIN"})

@app.route('/register', methods=['GET', 'POST'])
def register():
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
    #  movielist = recommendMoviesNew(genrelist)
    for movie in movielist:
        rec = Recommendation(user_id = current_user.id, movie_title = movie)
        db.session.add(rec)
        db.session.commit()
    
    return jsonify({"movie_list" : movielist})

def raw_getmovielist():
    if (current_user.newuser):
        all_watched_movies = Recommendation.query(Recommendation.movie_title)\
                                .filter_by(user_id=current_user.id)\
                                .all()
    else:
        all_watched_movies = Recommendation.query(Recommendation.movie_title)\
                                .filter_by(user_id=current_user.id)\
                                .filter_by(watched=1).all()
    
    recommended_movies = []
    #  Run movie based recommendation algorithm
    # recommended_movies = core_algo(all_watched_movies)
    return {"movie_list" : recommended_movies}

# get recommended movie list based on history
@app.route("/getmovielist")
def getmovielist():
    return jsonify(raw_getmovielist())
    

@app.route("/updatehistory")
def watchmovie():
    if (current_user.newuser):
        User.query.filter_by(id=current_user.id).update({"newuser" : 0})
    
    moviename = json.loads(request.data)["movie_title"]
    Recommendation.query.filter_by(user_id = current_user.id)\
                        .filter_by(movie_title = moviename)\
                        .update({"watched" : 1})
    db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(port=5000, debug=True)
