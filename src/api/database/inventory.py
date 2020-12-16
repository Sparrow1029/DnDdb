from bson.objectid import ObjectId
from typing import List

from db import items_collection, weapons_collection, armor_collection

### HELPERS ###
def inventory_helper(item: dict) -> dict:
    item.update({
        "id": str(item["_id"])
    })
    del item["_id"]
    return item

def retrieve_all_items() -> List[dict]:
    items = [
        inventory_helper(item)
        for item in items_collection.find()
    ]
    return items or None

def retrieve_one_item(name: str) -> dict:
    item_obj = items_collection.find_one({"name": name.lower()})
    return inventory_helper(item_obj) or None

def retrieve_all_weapons() -> List[dict]:
    weapons = [
        inventory_helper(weapon)
        for weapon in weapons_collection.find()
    ]
    return weapons or None

def retrieve_one_weapon(name: str) -> dict:
    weapon_obj = weapons_collection.find_one({"name": name.lower()})
    return inventory_helper(weapon_obj) or None

def retrieve_all_armor() -> List[dict]:
    armor = [
        inventory_helper(armor)
        for armor in armor_collection.find()
    ]
    return armor or None

def retrieve_one_armor(name: str) -> dict:
    armor_obj = armor_collection.find_one({"name": name.lower()})
    return inventory_helper(armor_obj) or None
