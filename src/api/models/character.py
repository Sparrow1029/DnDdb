from typing import Optional, List, Dict, Union
from enum import Enum
from .items import Item, Armor, Weapon
# from bson.objectid import ObjectId

from pydantic import BaseModel, Field, conint, validator
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

class Alignment(str, Enum):
    lg = 'lawful_good'
    ng = 'neutral_good'
    cg = 'chaotic_good'
    ln = 'lawful_neutral'
    nn = 'neutral_neutral'
    cn = 'chaotic_neutral'
    le = 'lawful_evil'
    ne = 'neutral_evil'
    ce = 'chaotic_evil'

class RaceEnum(str, Enum):
    elf = 'elf'
    dwarf = 'dwarf'
    gnome = 'gnome'
    half_elf = 'half_elf'
    halfling = 'halfling'
    half_orc = 'half_orc'
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
    magic_user = 'magic_user'

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
    hp_bonus_per_die: Optional[int]
    survive_dead: Optional[int]
    survive_sys_shock: Optional[int]

class ChaMods(BaseModel):
    max_henchmen: Optional[int]
    loyalty_bonus: Optional[int]
    reaction_bonus: Optional[int]

class WisMods(BaseModel):
    mental_save: Optional[int]

class SavingThrows(BaseModel):
    aimed_magic_items: Optional[int]
    breath_weapons: Optional[int]
    death_paralysis_poison: Optional[int]
    petrifaction_polymorph: Optional[int]
    unlisted_spells: Optional[int]

class BaseMods(BaseModel):
    str_mods: Optional[StrMods]
    dex_mods: Optional[DexMods]
    con_mods: Optional[ConMods]
    cha_mods: Optional[ChaMods]
    wis_mods: Optional[WisMods]

class ThiefSkills(BaseModel):
    climb_walls: float
    find_traps: float
    hear_noise: float
    hide_in_shadows: float
    move_quietly: float
    open_locks: float
    pick_pockets: float
    read_languages: float

class EquippedWeapons(BaseModel):
    main_hand: Optional[Weapon]
    off_hand: Optional[Weapon]
    ranged: Optional[Weapon]
    other: Optional[List[Weapon]]

class EquippedArmor(BaseModel):
    armor: Optional[Armor]
    shield: Optional[Armor]
    gloves_rings: Optional[List[Item]]
    boots_footwear: Optional[Item]
    bracers: Optional[Armor]
    capes_cloaks: Optional[List[Item]]
    other: Optional[List[Union[Item, Armor]]]

class Equipment(BaseModel):
    weapons: Optional[List[Weapon]]
    armor: Optional[List[Armor]]
    items: Optional[List[Item]]

class Inventory(BaseModel):
    equipment: Optional[Equipment]
    equipped_armor: Optional[EquippedArmor]
    equipped_weapons: Optional[EquippedWeapons]

class CharacterSchema(BaseModel):
    name: str
    gender: Gender
    race: RaceEnum
    class_: ClassEnum
    alignment: Alignment
    level: int = Field(default_factory=lambda: 1)
    base_mods: Optional[BaseMods]
    base_stats: StatSchema
    cur_stats: Optional[StatSchema]
    saving_throws: Optional[SavingThrows]
    languages: Optional[List[str]]
    max_addl_langs: Optional[int]
    racial_abilities: Optional[dict]
    thief_skills: Optional[ThiefSkills]
    inventory: Optional[Inventory]
    max_hp: Optional[int]
    cur_hp: Optional[int]
    exp: int = 0
    exp_next_lvl: Optional[int]
    ac: Optional[int]
    height: Optional[Dict[str, int]]
    weight: Optional[int]
    age: Optional[int]
    alive: bool = True
    created_at: datetime = Field(default_factory=datetime.now)
    owner: Optional[str]

    class Config:
        fields = {
            "class_": "class"
        }

    @validator('name')
    def name_alpha_only(cls, v):
        if len(v) not in range(1, 65):
            raise ValueError('Name must be between 1-64 characters')
        if not all(char.isalpha() or char in "'- " for char in v):
            raise ValueError('Invalid characters in name')
        return v