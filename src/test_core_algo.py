import sys
import csv

sys.path.append("./src/")
from core_algo import (
    recommend_by_all_genres,
    core_algo,
    surprise_me,
    search_year,
    sort_year,
)

csv_file_path = "./data/movies.csv"


def get_genres_for_movie(movie_title):
    genres = []
    with open(csv_file_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            if row["title"] == movie_title:
                genres = row["genres"].split("|")

    return genres


def test_core_algo_mystery_fantasy():
    specified_genres = ["Mystery", "Fantasy"]
    result = recommend_by_all_genres(specified_genres)

    for movie in result:
        movie_genres = get_genres_for_movie(movie[0])
        for genre in specified_genres:
            assert genre in movie_genres


def test_core_algo_comedy_romance():
    specified_genres = ["Comedy", "Romance"]
    result = recommend_by_all_genres(specified_genres)

    for movie in result:
        movie_genres = get_genres_for_movie(movie[0])
        for genre in specified_genres:
            assert genre in movie_genres


def test_core_algo_action_thriller():
    specified_genres = ["Action", "Thriller"]
    result = recommend_by_all_genres(specified_genres)

    for movie in result:
        movie_genres = get_genres_for_movie(movie[0])
        for genre in specified_genres:
            assert genre in movie_genres


def test_core_algo_horror_mystery():
    specified_genres = ["Horror", "Mystery"]
    result = recommend_by_all_genres(specified_genres)

    for movie in result:
        movie_genres = get_genres_for_movie(movie[0])
        for genre in specified_genres:
            assert genre in movie_genres


def test_core_algo_advent_children_fantasy():
    specified_genres = ["Adventure", "Children", "Fantasy"]
    result = recommend_by_all_genres(specified_genres)

    for movie in result:
        movie_genres = get_genres_for_movie(movie[0])
        for genre in specified_genres:
            assert genre in movie_genres


def test_core_algo_crime_drama_thriller():
    specified_genres = ["Crime", "Drama", "Thriller"]
    result = recommend_by_all_genres(specified_genres)

    for movie in result:
        movie_genres = get_genres_for_movie(movie[0])
        for genre in specified_genres:
            assert genre in movie_genres


def test_core_algo_drama_children_musical():
    specified_genres = ["Drama", "Children", "Musical"]
    result = recommend_by_all_genres(specified_genres)

    for movie in result:
        movie_genres = get_genres_for_movie(movie[0])
        for genre in specified_genres:
            assert genre in movie_genres


def test_core_algo_comedy():
    specified_genres = ["Comedy"]
    result = recommend_by_all_genres(specified_genres)

    for movie in result:
        movie_genres = get_genres_for_movie(movie[0])
        for genre in specified_genres:
            assert genre in movie_genres


def test_core_algo_drama():
    specified_genres = ["Drama"]
    result = recommend_by_all_genres(specified_genres)

    for movie in result:
        movie_genres = get_genres_for_movie(movie[0])
        for genre in specified_genres:
            assert genre in movie_genres


def test_core_algo_horror():
    specified_genres = ["Horror"]
    result = recommend_by_all_genres(specified_genres)

    for movie in result:
        movie_genres = get_genres_for_movie(movie[0])
        for genre in specified_genres:
            assert genre in movie_genres


def test_core_algo_genre_consistency_two():
    list_movies = ["Toy Story (1995)", "Jumanji (1995)"]
    result = core_algo(list_movies)

    watched_genres = set()
    for movie in list_movies:
        watched_genres.update(get_genres_for_movie(movie[0]))

    for movie, processed_movie in result[0:200]:
        recommended_genres = get_genres_for_movie(movie[0])
        assert all(
            genre in recommended_genres for genre in watched_genres
        )  # At least one genre must match


def test_core_algo_genre_consistency_three():
    list_movies = [
        "Jeff Ross Roasts the Border (2017)",
        "The Man Who Killed Don Quixote (2018)",
        "Game Over, Man! (2018)",
    ]
    result = core_algo(list_movies)

    watched_genres = set()
    for movie in list_movies:
        watched_genres.update(get_genres_for_movie(movie[0]))

    for movie, processed_movie in result[0:200]:
        recommended_genres = get_genres_for_movie(movie[0])
        assert all(
            genre in recommended_genres for genre in watched_genres
        )  # At least one genre must match


def test_core_algo_genre_consistency_five():
    list_movies = [
        "Die Hard (1988)",
        "Terminator, The (1984)",
        "Missing in Action (1984)",
        "Missing in Action 2: The Beginning (1985)",
        "Braddock: Missing in Action III (1988)",
    ]
    result = core_algo(list_movies)

    watched_genres = set()
    for movie in list_movies:
        watched_genres.update(get_genres_for_movie(movie[0]))

    for movie, processed_movie in result[0:200]:
        recommended_genres = get_genres_for_movie(movie[0])
        assert all(
            genre in recommended_genres for genre in watched_genres
        )  # At least one genre must match


def test_core_algo_genre_consistency_single():
    list_movies = ["Andrew Dice Clay: Dice Rules (1991)"]
    result = core_algo(list_movies)

    watched_genres = set()
    for movie in list_movies:
        watched_genres.update(get_genres_for_movie(movie[0]))

    for movie, processed_movie in result[0:200]:
        recommended_genres = get_genres_for_movie(movie[0])
        assert all(
            genre in recommended_genres for genre in watched_genres
        )  # At least one genre must match


def test_surprise_me_horror():

    watched_list = [
        "Lord of Illusions (1995)",
        "Father of the Bride Part II (1995)",
        "Sabrina (1995)",
        "American President, The (1995)",
    ]

    result = surprise_me(watched_list)

    watched_genres = set()
    for movie in watched_list:
        watched_genres.update(get_genres_for_movie(movie))

    for movie, processed_movie in result[0:200]:
        recommended_genres = get_genres_for_movie(movie)
        assert any(genre in recommended_genres for genre in watched_genres)


def test_surprise_me_comedy():

    watched_list = ["Father of the Bride Part II (1995)"]

    result = surprise_me(watched_list)

    watched_genres = set()
    for movie in watched_list:
        watched_genres.update(get_genres_for_movie(movie))

    for movie, processed_movie in result[0:200]:
        recommended_genres = get_genres_for_movie(movie)
        assert any(genre in recommended_genres for genre in watched_genres)


def test_search_year():
    result_titles, o_titles, result_year = search_year("1998")
    assert all("1998" in res for res in result_year)


def test_search_year_2():
    result_titles, o_titles, result_year = search_year("2005")
    assert all("2005" in res for res in result_year)


def test_search_year_wrong():
    result_titles, o_titles, result_year = search_year("1659")
    assert len(result_titles) == 0


def test_search_year_wrong_2():
    result_titles, o_titles, result_year = search_year("5000")
    assert len(result_titles) == 0


def test_sort_year():
    result_titles, o_titles, result_year = sort_year("ascending")

    unsorted_res = result_year.copy()
    result_year.sort()
    assert unsorted_res == result_year


def test_sort_year_descending():
    result_titles, o_titles, result_year = sort_year("descending")

    unsorted_res = result_year.copy()
    result_year.sort(reverse=True)
    assert unsorted_res == result_year