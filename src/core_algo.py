import csv
from collections import defaultdict

def put_article_first(movtitle):
    art = movtitle.split(",")
    AThe = ''
    if len(art) > 1:
        AThe = art[-1].strip() + ' '
    title = ''.join(movtitle.split(",")[0:len(art)-1])
    if (AThe == 'A ' or AThe == "The ") :
        return AThe + title
    else:
        return movtitle

def proc_movie_string(movie):
    movie = movie.strip()
    
    l = len(movie)
    ltitle = l - 6
    movtitle = movie[0:ltitle].strip()
    year = movie[l - 5 : l - 1]
    if (not year.isdigit()):
        year = "3000"
    translated_titles = movtitle.split("(")

    if (len(translated_titles) == 1):

        return put_article_first(movtitle), year
    else:
        engtitle = put_article_first(translated_titles[0])
        return engtitle, year

def core_algo(list_movies, csv_file):
    
    genre_count = defaultdict(int)  
    genre_movies = defaultdict(list) 
    watched_movies = set(list_movies)  

    with open(csv_file, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            movie_title = row['title']
            genres = row['genres'].split('|')  
            
            if movie_title in watched_movies:
                for genre in genres:
                    genre_count[genre] += 1 
            
            for genre in genres:
                genre_movies[genre].append(movie_title)

    sorted_genres = sorted(genre_count.items(), key=lambda x: x[1], reverse=True)
    top_genres = [genre for genre, count in sorted_genres[:10]]  

    recommendations = []
    
    for genre in top_genres:
        for movie in genre_movies[genre]:
            if movie not in watched_movies:
                recommendations.append(movie)
                if len(recommendations) >= 10: 
                    return [(rec, proc_movie_string(rec)) for rec in recommendations]
    
    return [(rec, proc_movie_string(rec)) for rec in recommendations]

def surprise_me(watched_list, csv_file):
    genre_count = defaultdict(int)
    genre_movies = defaultdict(list)
    watched_movies = set(watched_list)

    with open(csv_file, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)

        for row in reader:
            movie_title = row['title']
            genres = row['genres'].split('|')

            if movie_title in watched_movies:
                for genre in genres:
                    genre_count[genre] += 1

            for genre in genres:
                genre_movies[genre].append(movie_title)

    sorted_genres = sorted(genre_count.items(), key=lambda x: x[1])
    bottom_genres = [genre for genre, count in sorted_genres[:5]]

    recommendations = []

    for genre in bottom_genres:
        for movie in genre_movies[genre]:
            if movie not in watched_movies:
                recommendations.append(movie)
                if len(recommendations) >= 10:
                    return [(rec, proc_movie_string(rec)) for rec in recommendations]
    return [(rec, proc_movie_string(rec)) for rec in recommendations]

def recommend_by_all_genres(list_genres, csv_file):

    matching_movies = [] 

    with open(csv_file, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for rows in reader:
            movie_title = rows['title']
            genres = rows['genres'].split('|') 
            
            if all(genre in genres for genre in list_genres):
                matching_movies.append(movie_title)

    return [(rec, proc_movie_string(rec)) for rec in matching_movies[:50]]

def search_year(year, csv_file):
    matching_movies = [] 
    years = []

    with open(csv_file, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)

        for rows in reader:
            title, m_year = proc_movie_string(rows['title']);
            if m_year == year:
                matching_movies.append(title)
                years.append(m_year)
        
    return matching_movies, years

def keysort(title_tuple):
    return int(title_tuple[1])

def sort_year(y_order, csv_file):
    matching_movies = [] 

    with open(csv_file, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        title_list = []
        for rows in reader:
            title_tuple = proc_movie_string(rows['title']);
            title_list.append(title_tuple)
        
        title_list.sort(key = keysort, reverse=(y_order !="ascending"))
        matching_movies = [p[0] for p in title_list]
        years = [p[1] for p in title_list]

    return matching_movies, years
