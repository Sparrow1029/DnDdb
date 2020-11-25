from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from bcrypt import checkpw
from fastapi_jwt_auth import AuthJWT

from ..db import user_collection, database

revoked_tokens = database.revoked_tokens

router = APIRouter()

class UserAuthInput(BaseModel):
    username: str
    password: str

class TokenModel(BaseModel):
    access_token: str
    message: str = "Login successful"

@router.post(
    "/login",
    response_model=TokenModel,
    responses={
        200: {"description": "Login successful"},
        401: {"description": "Bad username or password"},
        404: {"description": "User not found"}})
def login(auth_data: UserAuthInput, Authorize: AuthJWT = Depends()):
    print(auth_data)
    user_dict = auth_data.dict()
    db_user = user_collection.find_one({"username": user_dict["username"]})
    if db_user:
        if checkpw(user_dict["password"].encode('utf-8'), db_user["password"]):
            token = Authorize.create_access_token(str(db_user["_id"]))
            return {"access_token": token, "message": "Login successful"}
        raise HTTPException(status_code=401, detail="Bad username or password")
    raise HTTPException(status_code=404, detail="User not found")

@router.post("/logout")
def logout():
    pass
