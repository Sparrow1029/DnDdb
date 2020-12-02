from bson.objectid import ObjectId
from typing import List

from db import class_collection

### HELPERS ###
def class_helper(class_: dict) -> dict:
    class_.update({
        "id": str(class_["_id"])
    })
    del class_["_id"]
    return class_

def retrieve_all_classes() -> List[dict]:
    classes = [
        class_helper(class_obj)
        for class_obj in class_collection.find()]
    return classes or None

def retrieve_one_class(class_name: str) -> dict:
    class_obj = class_collection.find_one({"name": class_name.lower()})
    return class_helper(class_obj) or None