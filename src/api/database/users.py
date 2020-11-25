# import motor.motor_asyncio as maio
from bson.objectid import ObjectId

from bcrypt import hashpw, gensalt

from db import user_collection, char_collection


### HELPERS ###
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"], "realname": user["realname"],
        "email": user["email"],
        "characters": [str(char_id) for char_id in user["characters"]],
        "created_at": user["created_at"],
    }

### VALIDATORS ###
def user_exists(user_data: dict) -> bool:
    query = user_collection.find_one({
        "$or": [
            {"email": user_data["email"]},
            {"username": user_data["username"]}
        ]
    })
    if query:
        return True
    return False

def user_id_exists(user_id: str) -> bool:
    res = user_collection.find_one({"_id": ObjectId(user_id)})
    if res:
        return True
    return False


### DB OPERATIONS ###
def retrieve_users():
    users = []
    for user in user_collection.find():
        users.append(user_helper(user))
    return users

def add_user(user_data: dict) -> dict:
    exists = user_exists(user_data)
    if exists:
        return False
    user_data["password"] = hashpw(user_data["password"].encode('utf-8'), gensalt())
    user = user_collection.insert_one(user_data)
    new_user = user_collection.find_one({"_id": user.inserted_id})
    if user:
        return user_helper(new_user)


def retrieve_user(id: str) -> dict:
    user = user_collection.find_one({"_id": ObjectId(id)})
    if user:
        return user_helper(user)


def update_user(id: str, data: dict):
    # Return False if an empty request body is sent
    if not data:
        return False
    if "password" in data.keys():
        data["password"] = hashpw(data["password"].encode('utf-8'), gensalt())
    user = user_collection.find_one({"_id": ObjectId(id)})
    if user:
        updated_user = user_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if updated_user:
            return True
        return False


def delete_user(id: str):
    from .characters import delete_user_characters
    user = user_collection.find_one({"_id": ObjectId(id)})
    if user:
        delete_user_characters(user)
        user_collection.delete_one({"_id": ObjectId(id)})
        return True

def delete_user_characters(characters: list) -> list:
    """Cascading delete when user is removed"""
    remaining = []
    for char_id in characters:
        res = char_collection.delete_one({"_id": ObjectId(char_id)})
        if not res.deleted_count == 1:
            remaining.append(char_id)
    return remaining

