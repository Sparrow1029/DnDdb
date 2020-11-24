import pytest
import os
os.environ["FASTAPI_ENV"] = "TESTING"
from starlette.testclient import TestClient
# from pymongo import MongoClient

from api.main import api


@pytest.fixture(scope="session", autouse=True)
def test_app():
    client = TestClient(api)
    yield client
    # mongo_client.drop_database('dnd_fastapi_test_db')
    os.environ["FASTAPI_ENV"] = "DEVELOPMENT"
