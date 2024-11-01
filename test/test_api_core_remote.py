import sys
import json

from requests import get, post

logged_in = 0
registered = 0


def apicall(endpoint, method):
    resp = method("http://127.0.0.1:5000/" + endpoint)
    # print(resp.json())
    # return resp.status_code, resp.json()


def formdata_apicall(endpoint, method, formdata, pcookies=None):
    resp = method("http://127.0.0.1:5000/" + endpoint, data=formdata, cookies=pcookies)
    return resp.status_code, resp.json()


def formdata_apicall2(endpoint, method, formdata, pcookies=None):
    resp = method("http://127.0.0.1:5000/" + endpoint, data=formdata, cookies=pcookies)

    return resp.status_code, resp.json(), resp


def formdata_apicall_opaque(endpoint, method, formdata, pcookies=None):
    resp = method("http://127.0.0.1:5000/" + endpoint, data=formdata, cookies=pcookies)

    return resp.status_code, resp


# tests

logged_in = 0


def test_apicall_select_genres():

    # register user
    user = {"username": "newuser", "password": "new_password"}
    code, res = formdata_apicall("register", post, user)

    code, res, resp = formdata_apicall2("login", post, user)
    user_cookies = resp.cookies

    # genres
    specified_genres = ["Action", "Thriller"]
    req_body = json.dumps({"genre_list": specified_genres})

    code, res, resp = formdata_apicall2(
        "registeruserprefs", get, req_body, pcookies=user_cookies
    )
    assert code == 200 and "movie_list" in dict(res).keys()


def test_apicall_recommend_movie_newuser():

    # register and login user
    user = {"username": "newuser2", "password": "new_password2"}
    code, res = formdata_apicall("register", post, user)

    code, res, resp = formdata_apicall2("login", post, user)
    user_cookies = resp.cookies

    # recommend by genres
    specified_genres = ["Action", "Thriller"]
    req_body = json.dumps({"genre_list": specified_genres})

    code, res, resp = formdata_apicall2(
        "registeruserprefs", get, req_body, pcookies=user_cookies
    )

    # get recommendations without having watched
    code, res, resp = formdata_apicall2(
        "getmovielist", get, req_body, pcookies=user_cookies
    )
    assert code == 200 and "movie_list" in dict(res).keys()


def test_apicall_update_user_history():

    # register and login user
    user = {"username": "newuser3", "password": "new_password3"}
    code, res = formdata_apicall("register", post, user)

    code, res, resp = formdata_apicall2("login", post, user)
    user_cookies = resp.cookies

    # genres
    specified_genres = ["Action", "Thriller"]
    req_body = json.dumps({"genre_list": specified_genres})

    code, res, resp = formdata_apicall2(
        "registeruserprefs", get, req_body, pcookies=user_cookies
    )

    # user selects new movie from movielist
    movie_user_watched = res["movie_list"][0]
    send_movie_title = json.dumps({"movie_title": movie_user_watched})

    # user clicks watch button
    code, resp = formdata_apicall_opaque(
        "updatehistory", get, send_movie_title, pcookies=user_cookies
    )


def test_recommend_based_on_watched_history():
    user = {"username": "newuser4", "password": "new_password4"}
    code, res = formdata_apicall("register", post, user)

    code, res, resp = formdata_apicall2("login", post, user)
    user_cookies = resp.cookies

    # genres
    specified_genres = ["Action", "Thriller"]
    req_body = json.dumps({"genre_list": specified_genres})

    code, res, resp = formdata_apicall2(
        "registeruserprefs", get, req_body, pcookies=user_cookies
    )

    # user selects new movie from movielist
    movie_user_watched = res["movie_list"][3]
    send_movie_title = json.dumps({"movie_title": movie_user_watched})

    # user clicks watch button
    code, resp = formdata_apicall_opaque(
        "updatehistory", get, send_movie_title, pcookies=user_cookies
    )

    # user gets new list based on watched recommendations
    code, res, resp = formdata_apicall2("/getmovielist", get, "", pcookies=user_cookies)
    assert code == 200 and "movie_list" in dict(res).keys()


def test_recommend_search():
    user = {"username": "newuser5", "password": "new_password5"}
    code, res = formdata_apicall("register", post, user)

    code, res, resp = formdata_apicall2("login", post, user)
    user_cookies = resp.cookies

    # user searches movie
    movie_search_query = "fight club"
    req_body = json.dumps({"contains": movie_search_query})

    code, res, resp = formdata_apicall2(
        "searchquery", get, req_body, pcookies=user_cookies
    )

    assert code == 200 and "movie_list" in dict(res).keys()


def test_recommend_sort():
    user = {"username": "newuser6", "password": "new_password5"}
    code, res = formdata_apicall("register", post, user)

    code, res, resp = formdata_apicall2("login", post, user)
    user_cookies = resp.cookies

    # user searches movie

    code, res, resp = formdata_apicall2(
        "sortyears", get, "ascending", pcookies=user_cookies
    )

    assert code == 200 and "movie_list" in dict(res).keys()


def test_recommend_sort_descending():
    user = {"username": "newuser7", "password": "new_password5"}
    code, res = formdata_apicall("register", post, user)

    code, res, resp = formdata_apicall2("login", post, user)
    user_cookies = resp.cookies

    # user searches movie

    code, res, resp = formdata_apicall2(
        "sortyears", get, "descending", pcookies=user_cookies
    )

    assert code == 200 and "movie_list" in dict(res).keys()


def test_recommend_searchyear():
    user = {"username": "newuser8", "password": "new_password5"}
    code, res = formdata_apicall("register", post, user)

    code, res, resp = formdata_apicall2("login", post, user)
    user_cookies = resp.cookies

    # user searches movie
    req_body = json.dumps({"year": "1998"})

    code, res, resp = formdata_apicall2(
        "searchyear", get, req_body, pcookies=user_cookies
    )

    assert code == 200 and "movie_list" in dict(res).keys()
