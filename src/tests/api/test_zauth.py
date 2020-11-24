from .helpers import create_user, login_user
from .data.users import tolkien01


def test_login(test_app):
#     create = create_user(test_app, tolkien01)
#     assert create.status_code == 200
    print(test_app.get("/users").json())
    login_resp = login_user(test_app, tolkien01["username"], tolkien01["password"])
    print(login_resp.headers)
    print(login_resp.reason)
    print(login_resp.status_code)
    # assert login_resp.status_code == 200
    data = login_resp.json()
    print(data)
    assert data["message"] == "Login successful"
    assert "access_token" in data
