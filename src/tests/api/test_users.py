from .data.users import tolkien01, rasalvatore
from .helpers import create_user
from pprint import pprint


def test_create_users(test_app):
    user1 = create_user(test_app, tolkien01).json()
    print("\nUSER 1")
    pprint(user1)
    assert user1["msg"] == "User created successfully"
    user2 = create_user(test_app, rasalvatore).json()
    print("\nUSER 2")
    pprint(user2)
    assert user2["msg"] == "User created successfully"


def test_users_exist(test_app):
    response = test_app.get("/users")
    assert response.status_code == 200
    # pprint(response.json())
    data = response.json()["data"]
    pprint(data)
    assert len(data) == 2
    assert [user["username"] for user in data] == ["tolkien01", "drizztr0cks"]
