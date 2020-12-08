from bson.objectid import ObjectId

from db import race_collection

### HELPERS ###
def race_helper(race) -> dict:
    race.update({
        "id": str(race["_id"])
    })
    del race["_id"]
    return race

def retrieve_all_races() -> list:
    races = [race_helper(race_obj) for race_obj in race_collection.find()]
    return races or None

def retrieve_one_race(race_name: str):
    race_obj = race_collection.find_one({"name": race_name})
    return race_helper(race_obj) or None