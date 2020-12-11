from pydantic import BaseModel
from typing import Optional
from enum import Enum

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

class Category(str, Enum):
    melee = 'melee'
    missile = 'missile'

class Subcategory(str, Enum):
    ranged = 'ranged'
    one_handed = 'one_handed'
    two_handed = 'two_handed'
    ammunition = 'ammunition'

class MeleeType(str, Enum):
    bow = 'bow'
    stab = 'stab'
    blade = 'blade'
    blunt = 'blunt'
    polearm = 'polearm'

class Weapon(BaseModel):
    name: str
    dmg_sm_md: str
    dmg_lg: str
    encumbrance: float
    cost: float
    category: Category
    subcategory: Subcategory
    rate_of_fire: Optional[float]
    range: Optional[int]