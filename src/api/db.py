# import motor.motor_asyncio as maio
import os
from pymongo import MongoClient
import mongomock

MONGO_DETAILS = os.getenv("MONGO_URL")
environ = os.getenv("FASTAPI_ENV")

if environ == "TESTING":
    client = mongomock.MongoClient()
    database = client.dnd_fastpi_test_db
else:
    client = MongoClient(MONGO_DETAILS)
    database = client.dnd_fastapi_dev

user_collection = database.users_collection
char_collection = database.characters_collection
class_collection = database.classes_collection
