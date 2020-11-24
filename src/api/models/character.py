from typing import Optional, List
from enum import Enum
# from bson.objectid import ObjectId

from pydantic import BaseModel, Field, conint  # validator
from datetime import datetime


class StatSchema(BaseModel):
    str: conint(ge=1, le=19)
    dex: conint(ge=1, le=19)
    con: conint(ge=1, le=19)
    int: conint(ge=1, le=19)
    wis: conint(ge=1, le=19)
    cha: conint(ge=1, le=19)

class Gender(str, Enum):
    male = 'male'
    female = 'female'

class RaceEnum(str, Enum):
    elf = 'elf'
    dwarf = 'dwarf'
    gnome = 'gnome'
    half_elf = 'half-elf'
    half_orc = 'half-orc'
    human = 'human'

class ClassEnum(str, Enum):
    assassin = 'assassin'
    druid = 'druid'
    thief = 'thief'
    cleric = 'cleric'
    paladin = 'paladin'
    ranger = 'ranger'
    fighter = 'fighter'
    illusionist = 'illusionist'
    magic_user = 'magic user'

class StrMods(BaseModel):
    hit_bonus: Optional[int]
    dmg_bonus: Optional[int]
    encumb_adj: Optional[int]
    minor_tests: Optional[str]
    major_tests: Optional[str]

class DexMods(BaseModel):
    surprise: Optional[int]
    to_hit: Optional[int]
    ac: Optional[int]

class ConMods(BaseModel):
    hit_per_die: Optional[int]
    survive_dead: Optional[int]
    survive_sys_shock: Optional[int]

class ChaMods(BaseModel):
    max_henchmen: Optional[int]
    loyalty_bonus: Optional[int]
    reaction_bonus: Optional[int]

class SavingThrows(BaseModel):
    mental_save: Optional[int]
    aimed_magic_items: Optional[int]
    breath_weapons: Optional[int]
    poison: Optional[int]
    petrifaction: Optional[int]
    spells: Optional[int]

class BaseMods(BaseModel):
    str_mods: Optional[StrMods]
    dex_mods: Optional[DexMods]
    con_mods: Optional[ConMods]
    cha_mods: Optional[ChaMods]

class ThiefSkills(BaseModel):
    climb_walls: float
    find_traps: float
    hear_noise: float
    hide_in_shadows: float
    move_quietly: float
    open_locks: float
    pick_pockets: float
    read_languages: float

class CharacterSchema(BaseModel):
    name: str
    gender: Gender
    race: RaceEnum
    class_: ClassEnum
    level: int = Field(default_factory=lambda: 1)
    base_mods: Optional[BaseMods]
    base_stats: StatSchema
    cur_stats: Optional[StatSchema]
    saving_throws: Optional[SavingThrows]
    languages: Optional[List[str]]
    max_addl_langs: Optional[int]
    racial_abilities: Optional[dict]
    thief_skills: Optional[ThiefSkills]
    max_hp: int
    cur_hp: int
    exp: int = 0
    ac: int
    alive: bool = True
    created_at: datetime = Field(default_factory=datetime.now)
    owner: str

    class Config:
        fields = {
            "class_": "class"
        }
