from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi_jwt_auth import AuthJWT

from bson import ObjectId

from database import (
    # char_helper,
    user_id_exists,
    add_char_to_user,
    create_character,
    retrieve_user,
    retrieve_user_characters,
    retrieve_one_character,
    delete_character,
    update_character
)
from models.character import (
    CharacterSchema
)

router = APIRouter()

@router.post("/create")
def add_new_character(
        char_data: CharacterSchema = Body(...),
        Authorize: AuthJWT = Depends()
    ):
    Authorize.jwt_required()
    cur_user_id = Authorize.get_jwt_identity()
    if not user_id_exists(cur_user_id):
        raise HTTPException(status_code=406, detail="User does not exist")
    if not cur_user_id:
        raise HTTPException(status_code=401, detail="You are not logged in")

    char_dict = char_data.dict()
    char_dict["owner"] = cur_user_id
    char_dict["class"] = char_dict.pop("class_")
    char = jsonable_encoder(char_dict)
    new_char = create_character(char)
    if new_char:
        added_to_player = add_char_to_user(cur_user_id, new_char["id"])
        if not added_to_player:
            # TODO: Figure out how to handle this
            print("ERROR")
        return {"data": new_char, "msg": "Character created successfully"}
    raise HTTPException(status_code=500, detail="User not found")

@router.get("/all/{user_id}")
def get_characters(user_id):
    if user_id is not None and ObjectId.is_valid(user_id):
        user = retrieve_user(user_id)
        chars = retrieve_user_characters(user["characters"])
        if chars is not None:
            return {"characters": chars, "msg": "Characters retrieved successfully"}
        raise HTTPException(status_code=409, detail="Error retrieving characters")
    raise HTTPException(status_code=400, detail="Bad user id")


@router.get("/{char_id}", response_model=CharacterSchema)
def get_single_character(char_id):
    print(ObjectId.is_valid(char_id))
    if char_id and ObjectId.is_valid(char_id):
        char = retrieve_one_character(char_id)
        if char:
            return char
        raise HTTPException(status_code=404, detail="Character not found")
    raise HTTPException(status_code=400, detail="Bad character id")


@router.delete("/{char_id}")
def delete_single_character(char_id, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    cur_user_id = Authorize.get_jwt_identity()

    char = retrieve_one_character(char_id)
    if char:
        if char["owner"] != cur_user_id:
            raise HTTPException(status_code=401, detail="Unauthorized to delete character")
        deleted = delete_character(char_id, cur_user_id)
        if deleted:
            return {"msg": "Character successfully deleted"}
        raise HTTPException(status_code=500, detail="Something went wrong")
    raise HTTPException(status_code=404, detail="Character not found")

@router.patch("/{char_id}")
def update_char(
        char_id: str,
        char_data: CharacterSchema = Body(...),
        Authorize: AuthJWT = Depends()
    ):
    Authorize.jwt_required()
    cur_user_id = Authorize.get_jwt_identity()

    char = retrieve_one_character(char_id)
    if char["owner"] != cur_user_id:
        raise HTTPException(status_code=401, detail="Unauthorized to update character")
    del char["id"]
    updated = update_character(char_id, char)
    print(updated)
    if updated:
        return { "data": updated, "msg": "Updated successfully" }
    raise HTTPException(status_code=500, detail="FUCK")
