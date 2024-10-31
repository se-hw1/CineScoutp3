import sys
import csv
sys.path.append("./src/")
from core_algo import recommend_by_all_genres, core_algo, surprise_me, search_year, sort_year

def get_genres_for_movie(movie_title, csv_file_path):
    genres = []
    with open(csv_file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            if (row['title'] == movie_title):
                genres = row['genres'].split('|')  
        
    return genres

#1
def test_core_algo_mystery_fantasy():
        specified_genres = ['Mystery', 'Fantasy']
        result = recommend_by_all_genres(specified_genres, "./data/movies.csv")

        for movie in result:
            movie_genres = get_genres_for_movie(movie[0], "./data/movies.csv")
            for genre in specified_genres:
                assert genre in movie_genres
#2
def test_core_algo_comedy_romance():
    specified_genres = ['Comedy', 'Romance']
    result = recommend_by_all_genres(specified_genres, "./data/movies.csv")
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie[0], "./data/movies.csv")
        for genre in specified_genres:
            assert genre in movie_genres
#3
def test_core_algo_action_thriller():
    specified_genres = ['Action', 'Thriller']
    result = recommend_by_all_genres(specified_genres, "./data/movies.csv")
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie[0], "./data/movies.csv")
        for genre in specified_genres:
            assert genre in movie_genres
#4
def test_core_algo_horror_mystery():
    specified_genres = ['Horror', 'Mystery']
    result = recommend_by_all_genres(specified_genres, "./data/movies.csv")
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie[0], "./data/movies.csv")
        for genre in specified_genres:
            assert genre in movie_genres

#5
def test_core_algo_advent_children_fantasy():
    specified_genres = ['Adventure', 'Children','Fantasy']
    result = recommend_by_all_genres(specified_genres, "./data/movies.csv")
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie[0], "./data/movies.csv")
        for genre in specified_genres:
            assert genre in movie_genres

#6
def test_core_algo_crime_drama_thriller():
    specified_genres = ['Crime', 'Drama','Thriller']
    result = recommend_by_all_genres(specified_genres, "./data/movies.csv")
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie[0], "./data/movies.csv")
        for genre in specified_genres:
            assert genre in movie_genres
#7
def test_core_algo_drama_children_musical():
    specified_genres = ['Drama', 'Children','Musical']
    result = recommend_by_all_genres(specified_genres, "./data/movies.csv")
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie[0], "./data/movies.csv")
        for genre in specified_genres:
            assert genre in movie_genres

#8
def test_core_algo_comedy():
    specified_genres = ['Comedy']
    result = recommend_by_all_genres(specified_genres, "./data/movies.csv")
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie[0], "./data/movies.csv")
        for genre in specified_genres:
            assert genre in movie_genres
#9
def test_core_algo_drama():
    specified_genres = ['Drama']
    result = recommend_by_all_genres(specified_genres, "./data/movies.csv")
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie[0], "./data/movies.csv")
        for genre in specified_genres:
            assert genre in movie_genres
#10
def test_core_algo_horror():
    specified_genres = ['Horror']
    result = recommend_by_all_genres(specified_genres, "./data/movies.csv")
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie[0], "./data/movies.csv")
        for genre in specified_genres:
            assert genre in movie_genres

def test_core_algo_genre_consistency_two():
    list_movies = ["Toy Story (1995)", "Jumanji (1995)"]  
    result = core_algo(list_movies, "./data/movies.csv")
    
    # genres of the watched movies
    watched_genres = set()
    for movie in list_movies:
        watched_genres.update(get_genres_for_movie(movie[0], "./data/movies.csv"))
    
    # recommendations genres with the watched movies genres comparison
    for movie, processed_movie in result:
        recommended_genres = get_genres_for_movie(movie[0], "./data/movies.csv")
        assert all(genre in recommended_genres for genre in watched_genres)  # At least one genre must match

def test_core_algo_genre_consistency_three():
    list_movies = ["Jeff Ross Roasts the Border (2017)", "The Man Who Killed Don Quixote (2018)", "Game Over, Man! (2018)"]
    result = core_algo(list_movies, "./data/movies.csv")
    
    # genres of the watched movies
    watched_genres = set()
    for movie in list_movies:
        watched_genres.update(get_genres_for_movie(movie[0], "./data/movies.csv"))
    
    # recommendations genres with the watched movies genres comparison
    for movie, processed_movie in result:
        recommended_genres = get_genres_for_movie(movie[0], "./data/movies.csv")
        assert all(genre in recommended_genres for genre in watched_genres)  # At least one genre must match

def test_core_algo_genre_consistency_five():
    list_movies = ["Die Hard (1988)", "Terminator, The (1984)", "Missing in Action (1984)", "Missing in Action 2: The Beginning (1985)", "Braddock: Missing in Action III (1988)"]  
    result = core_algo(list_movies, "./data/movies.csv")
    
    # genres of the watched movies
    watched_genres = set()
    for movie in list_movies:
        watched_genres.update(get_genres_for_movie(movie[0], "./data/movies.csv"))
    
    # recommendations genres with the watched movies genres comparison
    for movie, processed_movie in result:
        recommended_genres = get_genres_for_movie(movie[0], "./data/movies.csv")
        assert all(genre in recommended_genres for genre in watched_genres)  # At least one genre must match

def test_core_algo_genre_consistency_single():
    list_movies = ["Andrew Dice Clay: Dice Rules (1991)"]  
    result = core_algo(list_movies, "./data/movies.csv")
    
    # genres of the watched movies
    watched_genres = set()
    for movie in list_movies:
        watched_genres.update(get_genres_for_movie(movie[0], "./data/movies.csv"))
    
    # recommendations genres with the watched movies genres comparison
    for movie, processed_movie in result:
        recommended_genres = get_genres_for_movie(movie[0], "./data/movies.csv")
        assert all(genre in recommended_genres for genre in watched_genres)  # At least one genre must match

def test_surprise_me_horror():
    # Define the watched list for the test
    watched_list = ["Lord of Illusions (1995)","Father of the Bride Part II (1995)", "Sabrina (1995)", "American President, The (1995)"]
    
    # Call the surprise_me function to get recommendations
    result = surprise_me(watched_list, "./data/movies.csv")
    
    # Get genres of the watched movie
    watched_genres = set()
    for movie in watched_list:
        watched_genres.update(get_genres_for_movie(movie, "./data/movies.csv"))
    
    # Check each recommended movie to ensure it shares at least one genre with watched genres
    for movie, processed_movie in result:
        recommended_genres = get_genres_for_movie(movie, "./data/movies.csv")
        assert any(genre in recommended_genres for genre in watched_genres)

def test_surprise_me_comedy():
    # Define the watched list for the test
    watched_list = ["Father of the Bride Part II (1995)"]
    
    # Call the surprise_me function to get recommendations
    result = surprise_me(watched_list, "./data/movies.csv")
    
    # Get genres of the watched movie
    watched_genres = set()
    for movie in watched_list:
        watched_genres.update(get_genres_for_movie(movie, "./data/movies.csv"))
    
    # Check each recommended movie to ensure it shares at least one genre with watched genres
    for movie, processed_movie in result:
        recommended_genres = get_genres_for_movie(movie, "./data/movies.csv")
        assert any(genre in recommended_genres for genre in watched_genres)
