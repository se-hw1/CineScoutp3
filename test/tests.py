# tests/test_auth.py

def test_register_success(client):
    response = client.post("/register", data={
        "username": "newuser",
        "password": "newpassword"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data["code"] == 200
    assert data["redirect_url_key"] == "LOGIN"
  
def test_register_existing_username(client, new_user):
    response = client.post("/register", data={
        "username": "testuser",
        "password": "anotherpassword"
    })
    assert response.status_code == 400
    data = response.get_json()
    assert data["code"] == 400
    assert data["redirect_url_key"] == "REGISTER"

def test_register_missing_fields(client):
    response = client.post("/register", data={
        "username": "",
        "password": ""
    })
    # Adjust assertions based on your error handling
    assert response.status_code == 400

def test_login_success(client, new_user):
    response = client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data["code"] == 200
    assert data["redirect_url_key"] == "HOME"

def test_login_invalid_username(client):
    response = client.post("/login", data={
        "username": "nonexistent",
        "password": "password"
    })
    assert response.status_code == 400
    data = response.get_json()
    assert data["code"] == 400
    assert data["redirect_url_key"] == "REGISTER"

def test_login_incorrect_password(client, new_user):
    response = client.post("/login", data={
        "username": "testuser",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    data = response.get_json()
    assert data["code"] == 401
    assert data["redirect_url_key"] == "LOGIN"

def test_logout_success(client, new_user):
    # First, log in the user
    client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    # Then, logout
    response = client.post("/logout")
    assert response.status_code == 200


def test_logout_without_login(client):
    response = client.post("/logout")
    # Assuming it requires login, expect a 401 Unauthorized
    assert response.status_code == 401

def test_register_user_prefs_success(client, new_user):
    # Log in first
    client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    prefs = {"genre_list": ["Action", "Comedy"]}
    response = client.post("/registeruserprefs", json=prefs)
    assert response.status_code == 200
    data = response.get_json()
    assert "movie_list" in data
    assert isinstance(data["movie_list"], list)

def test_register_user_prefs_invalid_data(client, new_user):
    # Log in first
    client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    prefs = {"invalid_key": ["Action"]}
    response = client.post("/registeruserprefs", json=prefs)
    # Adjust based on your error handling
    assert response.status_code == 400


def test_get_movie_list_new_user(client, new_user):
    # Log in first
    client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    response = client.post("/getmovielist")
    assert response.status_code == 200
    data = response.get_json()
    assert "movie_list" in data
    assert isinstance(data["movie_list"], list)


def test_get_movie_list_existing_user(client, new_user):
    # Log in and set newuser to 0
    client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    User.query.filter_by(username="testuser").update({"newuser": 0})
    db.session.commit()
    
    response = client.post("/getmovielist")
    assert response.status_code == 200
    data = response.get_json()
    assert "movie_list" in data
    assert isinstance(data["movie_list"], list)


def test_update_history_success(client, new_user):
    # Log in first
    client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    # Assume a recommendation exists
    rec = Recommendation(user_id=new_user.id, movie_title="Test Movie")
    db.session.add(rec)
    db.session.commit()
    
    response = client.post("/updatehistory", json={"movie_title": "Test Movie"})
    assert response.status_code == 200
    updated_rec = Recommendation.query.filter_by(movie_title="Test Movie").first()
    assert updated_rec.watched == 1


def test_update_history_invalid_movie(client, new_user):
    # Log in first
    client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    response = client.post("/updatehistory", json={"movie_title": "Nonexistent Movie"})
    # Adjust based on your error handling, possibly 404 or 200 with no changes
    assert response.status_code == 200
    # Verify that no movie was updated
    rec = Recommendation.query.filter_by(movie_title="Nonexistent Movie").first()
    assert rec is None


def test_surprise_me_success(client, new_user, mocker):
    # Mock the surprise_me function from core_algo
    mock_surprise_me = mocker.patch('app.surprise_me', return_value=[("Surprise Movie", ["Details"])])
    
    # Log in first
    client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    
    response = client.post("/surpriseme")
    assert response.status_code == 200
    data = response.get_json()
    assert "movie" in data
    assert data["movie"] == "Details"
    mock_surprise_me.assert_called_once()


def test_sort_years_ascending(client, new_user, mocker):
    # Mock the sort_year function from core_algo
    mock_sort_year = mocker.patch('app.sort_year', return_value=(["Movie1", "Movie2"], ["Movie3"], ["2020", "2021"]))
    
    # Log in first
    client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    
    response = client.post("/sortyears", data="ascending")
    assert response.status_code == 200
    data = response.get_json()
    assert "movie_list" in data
    assert data["movie_list"] == ["Movie1", "Movie2"]
    mock_sort_year.assert_called_with(True)


def test_sort_years_descending(client, new_user, mocker):
    # Mock the sort_year function from core_algo
    mock_sort_year = mocker.patch('app.sort_year', return_value=(["Movie2", "Movie1"], ["Movie3"], ["2021", "2020"]))
    
    # Log in first
    client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    
    response = client.post("/sortyears", data="descending")
    assert response.status_code == 200
    data = response.get_json()
    assert "movie_list" in data
    assert data["movie_list"] == ["Movie2", "Movie1"]
    mock_sort_year.assert_called_with(False)


def test_search_year_existing(client, new_user, mocker):
    # Mock the search_year function from core_algo
    mock_search_year = mocker.patch('app.search_year', return_value=(["Movie1"], ["Movie2"], ["2021"]))
    
    # Log in first
    client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    
    response = client.post("/searchyear", json={"year": "2021"})
    assert response.status_code == 200
    data = response.get_json()
    assert "movie_list" in data
    assert data["movie_list"] == ["Movie1"]
    mock_search_year.assert_called_with("2021")


def test_search_year_non_existing(client, new_user, mocker):
    # Mock the search_year function from core_algo
    mock_search_year = mocker.patch('app.search_year', return_value=([], [], []))
    
    # Log in first
    client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    
    response = client.post("/searchyear", json={"year": "1800"})
    assert response.status_code == 200
    data = response.get_json()
    assert "movie_list" in data
    assert data["movie_list"] == []
    mock_search_year.assert_called_with("1800")


def test_search_query_matching(client, new_user, mocker):
    # Mock the search_query function from core_algo
    mock_search_query = mocker.patch('app.search_query', return_value=(["Matching Movie"], ["Other Movie"]))
    
    # Log in first
    client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    
    response = client.post("/searchquery", json={"contains": "Matching"})
    assert response.status_code == 200
    data = response.get_json()
    assert "movie_list" in data
    assert data["movie_list"] == ["Matching Movie"]
    mock_search_query.assert_called_with("Matching")


def test_search_query_no_matches(client, new_user, mocker):
    # Mock the search_query function from core_algo
    mock_search_query = mocker.patch('app.search_query', return_value=([], []))
    
    # Log in first
    client.post("/login", data={
        "username": "testuser",
        "password": "testpassword"
    })
    
    response = client.post("/searchquery", json={"contains": "Nonexistent"})
    assert response.status_code == 200
    data = response.get_json()
    assert "movie_list" in data
    assert data["movie_list"] == []
    mock_search_query.assert_called_with("Nonexistent")































