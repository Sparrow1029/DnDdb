#import motor.motor_asyncio as maio
from bson.objectid import ObjectId
from .utils.create_new_char import BaseMods, RaceMods, apply_class_mods

from .users import retrieve_user, update_user
from db import char_collection, user_collection, class_collection
from pymongo import ReturnDocument

### HELPERS ###
def char_helper(char) -> dict:
    char.update({
        "id": str(char["_id"]),
        "owner": str(char["owner"])
    })
    del char["_id"]
    return char

### VALIDATORS ###
def char_exists(char_data: dict) -> bool:
    cursor = char_collection.find({
        "name": char_data["name"]
    })
    chk_char = cursor.to_list(length=1)
    if chk_char:
        return True
    return False


### DB OPERATIONS ###
def create_character(char_data: dict) -> dict:
    """
    Apply all modifications to character based on race, stats, and class
    before inserting into mongodb
    """
    BaseMods.apply(char_data)
    RaceMods.apply(char_data)

    class_obj = class_collection.find_one({"name": char_data["class"]})
    apply_class_mods(char_data, class_obj)

    char_data["cur_stats"] = char_data["base_stats"]
    char_data["max_hp"] += char_data["base_mods"]["con_mods"]["hp_bonus_per_die"]
    char_data["cur_hp"] = char_data["max_hp"]

    char = char_collection.insert_one(char_data)
    new_char = char_collection.find_one({"_id": char.inserted_id})
    if new_char:
        return char_helper(new_char)


def add_char_to_user(user_id, character_id):
    if None in [user_id, character_id]:
        return False
    player = retrieve_user(user_id)
    if not player:
        return False
    player["characters"].append(character_id)
    del player["id"]
    result = update_user(user_id, player)
    if result:
        return True


def retrieve_one_character(char_id: str) -> dict:
    char = char_collection.find_one({"_id": ObjectId(char_id)})
    if char:
        return char_helper(char)


def delete_character(char_id: str, user_id: str) -> bool:
    update_user = user_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$pull": { "characters": char_id }}
    )
    print(update_user.modified_count)
    result = char_collection.delete_one({"_id": ObjectId(char_id)})
    if result.deleted_count == 1:
       return True
    return False


def update_character(char_id: str, data) -> dict:
    updated_char = char_collection.find_one_and_update(
        {"_id": ObjectId(char_id)},
        {"$set": data}, return_document=ReturnDocument.AFTER, epsert=False
    )
    return char_helper(updated_char) or None
