"""
This is where the core recommendation algorithm functions live. 
core_algo recommends movies based on a movie list, and recommend_by_all_genres recommends based on a genre list.

"""

import sys
import csv
from collections import defaultdict
import string

csv_file = ""
if len(sys.argv) == 1 or sys.argv[1] == "--cov=.":
    csv_file = "./data/movies.csv"
else:
    csv_file = sys.argv[1]


def find_in_list(title, listp):
    T1_list = [
        s.lower().translate(str.maketrans("", "", string.punctuation))
        for s in title.split()
    ]
    for item in listp:
        l = len(item)
        title = item[0 : l - 6].strip()
        year = item[l - 5 : l - 1].strip()
        if not year.isdigit():
            year = "3000"

        cond = True
        T2 = (
            title.split("(")[0]
            .strip()
            .lower()
            .translate(str.maketrans("", "", string.punctuation))
        )
        T2_list = T2.split()
        # print(T2_list)
        # print(T1_list)
        for i in range(len(T2_list)):
            cond = cond and (T2_list[i] in T1_list[i])

        if cond:
            return item
    return ""


def put_article_first(movtitle):
    """
    Utility function to put title first
    :param str movtitle: movie title in the format "English title", The (YYYY)
    """
    art = movtitle.split(",")
    AThe = ""
    if len(art) > 1:
        AThe = art[-1].strip() + " "
    title = "".join(movtitle.split(",")[0 : len(art) - 1])
    if AThe == "A " or AThe == "The ":
        return AThe + title
    else:
        return movtitle


def proc_movie_string(movie):
    """
    Utility function to process movie string
    :param str movie: Movie string
    """
    movie = movie.strip()

    l = len(movie)
    ltitle = l - 6
    movtitle = movie[0:ltitle].strip()
    year = movie[l - 5 : l - 1]
    if not year.isdigit():
        year = "3000"
    translated_titles = movtitle.split("(")

    if len(translated_titles) == 1:

        return put_article_first(movtitle), year
    else:
        engtitle = put_article_first(translated_titles[0])
        return engtitle, year


def core_algo(list_movies):
    """
    The core algorithm function, recommends based on list of movies
    :param list list_movies: Input list of movies
    """

    genre_count = defaultdict(int)
    genre_movies = defaultdict(list)
    watched_movies = set(list_movies)

    with open(csv_file, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            movie_title = row["title"]
            genres = row["genres"].split("|")

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

    return [(rec, proc_movie_string(rec)) for rec in recommendations]


def surprise_me(watched_list):
    """
    Function for surprise-me frontend button
    :param list watched_list: List of movies already watched
    """
    genre_count = defaultdict(int)
    genre_movies = defaultdict(list)
    watched_movies = set(watched_list)

    with open(csv_file, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            movie_title = row["title"]
            genres = row["genres"].split("|")

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

    return [(rec, proc_movie_string(rec)) for rec in recommendations]


def recommend_by_all_genres(list_genres):
    """
    Function for recommending movies by genres. Is invoked when user first creates account.
    :param list list_genres: list of genres
    """

    matching_movies = []

    with open(csv_file, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for rows in reader:
            movie_title = rows["title"]
            genres = rows["genres"].split("|")

            if all(genre in genres for genre in list_genres):
                matching_movies.append(movie_title)

    return [(rec, proc_movie_string(rec)) for rec in matching_movies[:50]]


def search_year(year):
    """
    Function to search movie in a specific year.
    :param str year: Year to search
    """
    matching_movies = []
    o_matching_movies = []
    years = []

    with open(csv_file, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for rows in reader:
            title, m_year = proc_movie_string(rows["title"])
            if m_year == year:
                matching_movies.append(title)
                years.append(m_year)
                o_matching_movies.append(rows["title"])

    return matching_movies, o_matching_movies, years


def keysort(title_tuple):
    return int(title_tuple[1][1])


def sort_year(y_order):
    """
    Function to sort movies by year
    :param str y_order: can be 'ascending' or 'descending'
    """

    matching_movies = []
    o_matching_movies = []

    with open(csv_file, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        title_list = []
        for rows in reader:
            title_tuple = proc_movie_string(rows["title"])
            title_list.append((rows["title"], title_tuple))

        title_list.sort(key=keysort, reverse=(y_order != "ascending"))
        o_matching_movies = [p[0] for p in title_list]
        matching_movies = [p[1][0] for p in title_list]
        years = [p[1][1] for p in title_list]

    return matching_movies, o_matching_movies, years


def search_query(contains):
    """
    Function to sort movies by year
    :param str contains: words to be searched in the query
    """
    contains_tolower = [
        ele.strip().lower().translate(str.maketrans("", "", string.punctuation))
        for ele in contains.split()
    ]
    mlist = []
    olist = []
    with open("../../data/movies.csv", encoding="utf-8") as file:
        csvp = csv.DictReader(file)
        for row in csvp:
            title_tolower = (
                row["title"]
                .strip()
                .lower()
                .translate(str.maketrans("", "", string.punctuation))
                .split()
            )
            cond = True
            for contains_wrd in contains_tolower:
                cond = cond and (contains_wrd in title_tolower)
        if cond:
            mlist.append(proc_movie_string(row["title"])[0])
            olist.append(row["title"])
    return mlist, olist
