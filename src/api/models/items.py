from pydantic import BaseModel
from typing import Optional, Union
from enum import Enum

class Cost(BaseModel):
    gp: Optional[int]
    sp: Optional[int]
    cp: Optional[int]
    ep: Optional[int]
    pp: Optional[int]
    amtPer: Optional[int]

class Item(BaseModel):
    name: Optional[str]
    encumbrance: Optional[Union[float, int]]
    cost: Optional[Cost]

class Armor(BaseModel):
    name: Optional[str]
    encumbrance: Optional[Union[float, int]]
    max_move: Optional[int]
    ac: Optional[int]
    cost: Optional[Cost]

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
    name: Optional[str]
    dmg_sm_md: Optional[str]
    dmg_lg: Optional[str]
    encumbrance: Optional[Union[float, int]]
    cost: Optional[Cost]
    category: Optional[Category]
    subcategory: Optional[Subcategory]
    type: Optional[Type]
    rate_of_fire: Optional[Union[None, float]]
    range: Optional[Union[None, int]]
