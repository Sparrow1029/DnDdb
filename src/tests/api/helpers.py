def create_user(test_app, user_data):
    return test_app.post("/users/", json=user_data)


def login_user(test_app, username, password):
    data = {"username": username, "password": password}
    return test_app.post("auth/login", json=data)
