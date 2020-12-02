from pydantic import BaseModel

class RaceSchema(BaseModel):
    name: str
    description: str
    abilities_dict: dict
    languages: list
    permitted_classes: list