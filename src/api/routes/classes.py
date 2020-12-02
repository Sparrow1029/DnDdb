from fastapi import APIRouter, Body, HTTPException
from fastapi.encoders import jsonable_encoder

from database import (
    retrieve_all_classes,
    retrieve_one_class,
)

from models.classes import ClassSchema

router = APIRouter()

@router.get("/")
def get_all_classes():
    classes = retrieve_all_classes()
    if classes is not None:
        return {"classes": classes, "msg": "Classes retrieved successfully"}
    raise HTTPException(status_code=500, detail="Error retrieving classes")

@router.get("/{class_name}")
def get_one_class(class_name):
    class_obj = retrieve_one_class(class_name)
    if class_obj is not None:
        return {"class": class_obj, "msg": f"Class {class_name} retrieved successfully"}
    raise HTTPException(status_code=404, detail="Class not found")