import sys
sys.path.append("..")
from src import recommend_by_all_genres, get_genres_for_movie

#1
def test_core_algo_mystery_fantasy(self):
        specified_genres = ['Mystery', 'Fantasy']
        result = recommend_by_all_genres(specified_genres, self.csv_file_path)

        for movie in result:
            movie_genres = get_genres_for_movie(movie, self.csv_file_path)
            for genre in specified_genres:
                assert genre in movie_genres
#2
def test_core_algo_comedy_romance(self):
    specified_genres = ['Comedy', 'Romance']
    result = recommend_by_all_genres(specified_genres, self.csv_file_path)
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie, self.csv_file_path)
        for genre in specified_genres:
            assert genre in movie_genres
#3
def test_core_algo_action_thriller(self):
    specified_genres = ['Action', 'Thriller']
    result = recommend_by_all_genres(specified_genres, self.csv_file_path)
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie, self.csv_file_path)
        for genre in specified_genres:
            assert genre in movie_genres
#4
def test_core_algo_horror_mystery(self):
    specified_genres = ['Horror', 'Mystery']
    result = recommend_by_all_genres(specified_genres, self.csv_file_path)
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie, self.csv_file_path)
        for genre in specified_genres:
            assert genre in movie_genres

#5
def test_core_algo_advent_children_fantasy(self):
    specified_genres = ['Adventure', 'Children','Fantasy']
    result = recommend_by_all_genres(specified_genres, self.csv_file_path)
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie, self.csv_file_path)
        for genre in specified_genres:
            assert genre in movie_genres

#6
def test_core_algo_crime_drama_thriller(self):
    specified_genres = ['Crime', 'Drama','Thriller']
    result = recommend_by_all_genres(specified_genres, self.csv_file_path)
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie, self.csv_file_path)
        for genre in specified_genres:
            assert genre in movie_genres
#7
def test_core_algo_drama_children_musical(self):
    specified_genres = ['Drama', 'Children','Musical']
    result = recommend_by_all_genres(specified_genres, self.csv_file_path)
    
    for movie in result:
        movie_genres = get_genres_for_movie(movie, self.csv_file_path)
        for genre in specified_genres:
            assert genre in movie_genres