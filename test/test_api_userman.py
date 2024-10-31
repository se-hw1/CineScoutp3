import sys

from requests import get, post

logged_in = 0
registered = 0
user_cookies = None


def apicall(endpoint, method):
    resp = method("http://127.0.0.1:5000/"+endpoint)
    # print(resp.json())
    # return resp.status_code, resp.json()

def formdata_apicall(endpoint, method, formdata):
    resp = method("http://127.0.0.1:5000/"+endpoint, data=formdata)
    return resp.status_code, resp.json()

def formdata_apicall2(endpoint, method, formdata, pcookies=None):
    resp = method("http://127.0.0.1:5000/"+endpoint, data=formdata, cookies=pcookies)
    return resp.status_code, resp.json(), resp

def formdata_apicall_opaque(endpoint, method, formdata, pcookies=None):
    resp = method("http://127.0.0.1:5000/"+endpoint, data=formdata, cookies=pcookies)
    return resp.status_code, resp


# tests

def test_api_register():  
    # corresp_func = app.register
    global registered
    user = {'username' : "testuser", "password" : "test_password"}
    code, res = formdata_apicall("register", post, user)
    assert (code == 200 and res["code"] == 200)
    if code == 200: 
        registered = 1

def test_api_register_double(): 
    # corresp_func = app.register 
    global registered
    user = {'username' : "testuser", "password" : "test_password"}
    if registered == 0:
        formdata_apicall("register", post, user)
    code, res = formdata_apicall("register", post, user)
    assert (code == 200 and res["code"] == 400)

def test_api_validlogin():
    # corresp_func = app.login
    global user_cookies
    global logged_in
    user = {'username' : "testuser", "password" : "test_password"}
    code, resp, res= formdata_apicall2("login", post, user)
    user_cookies = res.cookies
    assert (code == 200 and resp["code"] == 200)
    if code == 200: 
        logged_in = 1

def test_api_logout():
    # corresp_func = app.logout
    global logged_in
    global user_cookies
    if logged_in == 1:
        code, res = formdata_apicall_opaque("logout", get, "", pcookies=user_cookies)
        assert code == 200
    assert True

def test_api_validlogin_double():
    global logged_in
    global user_cookies
    if logged_in == 1:
        code, res = formdata_apicall_opaque("logout", get, "", pcookies=user_cookies)
        logged_in = 0
        

    user = {'username' : "testuser", "password" : "test_password"}

    code, resp, res = formdata_apicall2("login", post, user)
    user_cookies = res.cookies
    code, resp, res = formdata_apicall2("login", post, user, pcookies = user_cookies)
    assert code == 200 and resp["code"] == 201

def test_api_invalid_login_username():
    global logged_in
    global user_cookies
    if logged_in == 1:
        code, res = formdata_apicall_opaque("logout", get, "", pcookies=user_cookies)
        logged_in = 0
    
    user = {'username' : "nonexistent_testuser", "password" : "test_password"}
    code, resp, res = formdata_apicall2("login", post, user)
    assert code == 200 and resp["code"] == 400

def test_api_invalid_login_password():
    global logged_in
    global user_cookies
    if logged_in == 1:
        code, res = formdata_apicall_opaque("logout", get, "", pcookies=user_cookies)
        logged_in = 0
    
    user = {'username' : "testuser", "password" : "incorrect_test_password"}
    code, resp, res = formdata_apicall2("login", post, user)
    assert code == 200 and resp["code"] == 401



        
    
