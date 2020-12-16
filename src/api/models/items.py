from pydantic import BaseModel
from typing import Optional, Union
from enum import Enum

class Cost(BaseModel):
    gp: int
    sp: int
    cp: int
    ep: int
    pp: int
    amtPer: int

class Item(BaseModel):
    name: str
    encumbrance: Union[float, int]
    cost: Cost

class Armor(BaseModel):
    name: str
    encumbrance: Union[float, int]
    max_move: int
    ac: int
    cost: Cost

class Category(str, Enum):
    melee = 'melee'
    missile = 'missile'

class Subcategory(str, Enum):
    ranged = 'ranged'
    one_handed = 'one_handed'
    two_handed = 'two_handed'
    ammunition = 'ammunition'

class Type(str, Enum):
    blade = 'blade'
    blunt = 'blunt'
    piercing = 'piercing'

class Weapon(BaseModel):
    name: str
    dmg_sm_md: str
    dmg_lg: str
    encumbrance: Union[float, int]
    cost: Cost
    category: Category
    subcategory: Subcategory
    type: Type
    rate_of_fire: Optional[float]
    range: Optional[int]
