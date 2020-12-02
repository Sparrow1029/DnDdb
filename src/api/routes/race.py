from fastapi import APIRouter, Body, HTTPException
from fastapi.encoders import jsonable_encoder

from database import (
    retrieve_one_race,
    retrieve_all_races,
)

from models.race import RaceSchema

router = APIRouter()

@router.get("/")
def get_all_races():
    races = retrieve_all_races()
    if races is not None:
        return {"races": races, "msg": "Races retrieved successfully"}
    raise HTTPException(status_code=500, detail="Error retrieving races")

@router.get("/{race_name}")
def get_one_race(race_name):
    race_obj = get_one_race(race_name)
    if race_obj is not None:
        return {"race": race_obj, "msg": f"Race {race_name} retrieved successfully"}
    raise HTTPException(status_code=404, detail="Race not found")