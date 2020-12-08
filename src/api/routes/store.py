from fastapi import APIRouter, Body, HTTPException
from fastapi.encoders import jsonable_encoder

from database import (
    retrieve_all_items,
    retrieve_all_armor,
    retrieve_all_weapons,
)

from models.items import Item, Armor, Weapon

router = APIRouter()

@router.get("/armor")
def get_armor():
    armor = retrieve_all_armor()
    if armor:
        return {"data": armor, "msg": "Armors retrieved succesfully"}
    raise HTTPException(status_code=409, detail="Error retrieving armor")

@router.get("/weapons")
def get_weapons():
    weapons = retrieve_all_weapons()
    if weapons:
        return {"data": weapons, "msg": "Armors retrieved succesfully"}
    raise HTTPException(status_code=409, detail="Error retrieving weapons")

@router.get("/items")
def get_items():
    items = retrieve_all_items()
    if items:
        return {"data": items, "msg": "Items retrieved succesfully"}
    raise HTTPException(status_code=409, detail="Error retrieving items")