from pydantic import BaseModel
from typing import Optional, List, Dict

class Restrictions(BaseModel):
    min_str: int
    min_dex: int
    min_con: int
    min_int: int
    min_wis: int
    min_cha: int
    hit_die: str
    alignment: List[str]
    armor: Optional[List[str]]
    shield: Optional[List[str]]
    weapons_permitted: List[str]
    proficiencies: Optional[str]
    penalty_to_hit: int

class SavingThrow(BaseModel):
    petrifaction_polymorph: int
    unlisted_spells: int
    aimed_magic_items: int
    death_paralysis_poison: int
    breath_weapons: int

class Ability(BaseModel):
    level: int
    ability: str
    description: str

class ClassSchema(BaseModel):
    name: str
    summary: str
    saving_throws: Dict[int, SavingThrow]
    ac_to_hit: Dict[int, Dict[int, int]]
    abilities: List[Ability]
    level_advancement: List[dict]
    img_url: str