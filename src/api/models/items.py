from pydantic import BaseModel
from typing import Optional

class Item(BaseModel):
    name: str
    weight: int
    cost: float

class Armor(BaseModel):
    name: str
    encumbrance: int
    max_move: int
    ac: int
    cost: float

class Weapon(BaseModel):
    name: str
    dmg_sm_md: str
    dmg_lg: str
    encumbrance: float
    cost: float
    category: str
    rate_of_fire: Optional[float]
    range: Optional[int]