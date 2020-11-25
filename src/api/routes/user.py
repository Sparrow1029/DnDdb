from fastapi import APIRouter, Body, HTTPException
from fastapi.encoders import jsonable_encoder

from database import (
    add_user,
    delete_user,
    retrieve_user,
    retrieve_users,
    update_user,
)
from models.user import (
    ErrorResponseModel,
    ResponseModel,
    UserSchema,
    UpdateUserModel,
    UserOutModel,
)

router = APIRouter()

@router.post(
    "/",
    responses={
        409: {"description": "Email or username already exists"},
        201: {"description:": "User created successfully"}
    },)
    # response_description="User data added into database")
def add_user_data(user: UserSchema = Body(...)):
    user = jsonable_encoder(user)
    new_user = add_user(user)
    if new_user:
        return {"user_data": new_user, "msg": "User created successfully"}
        # return ResponseModel(new_user, "User added successfully")
    # return ErrorResponseModel("User email or username already exists", 400, "Bad request")
    raise HTTPException(status_code=409, detail="User email or username already exists")


@router.get("/", response_description="Users retrieved")
def get_users():
    users = retrieve_users()
    if users:
        return ResponseModel(users, "Users data retrieved successfully")
    return ResponseModel(users, "Empty list returned")

@router.get("/{id}", response_model=UserOutModel)
def get_user_data(id):
    user = retrieve_user(id)
    if user:
        # return ResponseModel(user, "User data retrieved successfully")
        return user
    return ErrorResponseModel("An error occurred.", 404, "User not found")

@router.put("/{id}")
def update_user_data(id: str, req: UpdateUserModel = Body(...)):
    req = {k: v for k, v in req.dict().items() if v is not None}
    try:
        updated_user = update_user(id, req)
        if updated_user:
            return {f"User with ID: {id} updated successfully"}
            # return ResponseModel(
            #     f"User with ID: {id} update is successful",
            #     "User updated successfully")
        # return ErrorResponseModel(
        #     "An error occurred",
        #     404,
        #     f"There was an error updating user with ID {id}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)

@router.delete("/{id}")
def delete_user_data(id: str):
    deleted_user = delete_user(id)
    if deleted_user:
        return ResponseModel(
            f"User with ID: {id} removed", "User deleted successfully"
        )
    return ErrorResponseModel(
        "An error occurred", 404, f"User with ID {id} doesn't exist"
    )
