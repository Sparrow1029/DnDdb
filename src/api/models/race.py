from pydantic import BaseModel

class Sizes(BaseModel):
    male: dict
    female: dict

class RaceSchema(BaseModel):
    name: str
    description: str
    abilities_dict: dict
    languages: list
    permitted_classes: list
    sizes: Sizes
    starting_ages: dict