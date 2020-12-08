from collections import namedtuple

StrMods = namedtuple('StrMods', 'hit_bonus dmg_bonus encumb_adj minor_tests major_tests')
DexMods = namedtuple('DexMods', 'surprise to_hit ac')
ConMods = namedtuple('ConMods', 'hp_bonus_per_die survive_dead survive_sys_shock')
ChaMods = namedtuple('ChaMods', 'max_henchmen loyalty_bonus reaction_bonus')

strength_table = {
    3:  [-3, -1, -35, '1', '0'],
    4:  [-2, -1, -25, '1', '0'],
    5:  [-2, -1, -25, '1', '0'],
    6:  [-1, 0, -15, '1', '0'],
    7:  [-1, 0, -15, '1', '0'],
    8:  [0, 0, 0, '1-2', '1'],
    9:  [0, 0, 0, '1-2', '1'],
    10: [0, 0, 0, '1-2', '2'],
    11: [0, 0, 0, '1-2', '2'],
    12: [0, 0, 10, '1-2', '4'],
    13: [0, 0, 10, '1-2', '4'],
    14: [0, 0, 20, '1-2', '7'],
    15: [0, 0, 20, '1-2', '7'],
    16: [0, 1, 35, '1-3', '10'],
    17: [1, 1, 50, '1-3', '13'],
    18: [1, 2, 75, '1-3', '13'],
}

dex_table = {
    3:  [-3, -3, 4],
    4:  [-2, -2, 3],
    5:  [-1, -1, 2],
    6:  [0, 0, 1],
    7:  [0, 0, 0],
    8:  [0, 0, 0],
    9:  [0, 0, 0],
    10: [0, 0, 0],
    11: [0, 0, 0],
    12: [0, 0, 0],
    13: [0, 0, 0],
    14: [0, 0, 0],
    15: [0, 0, -1],
    16: [1, 1, -2],
    17: [2, 2, -3],
    18: [3, 3, -4],
    19: [3, 3, -4],
}

const_table = {
    3:  [-2, 40, 35],
    4:  [-1, 45, 40],
    5:  [-1, 50, 45],
    6:  [-1, 55, 50],
    7:  [0, 60, 55],
    8:  [0, 65, 60],
    9:  [0, 70, 65],
    10: [0, 75, 70],
    11: [0, 80, 75],
    12: [0, 85, 80],
    13: [0, 90, 85],
    14: [0, 92, 88],
    15: [1, 94, 91],
    16: [2, 96, 95],
    17: [2, 98, 97],
    18: [2, 100, 99],
    19: [2, 100, 99],

}

intel_table = {
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 1,
    9: 1,
    10: 2,
    11: 2,
    12: 3,
    13: 3,
    14: 4,
    15: 4,
    16: 5,
    17: 6,
    18: 7,
    19: 8,
}

wis_table = {
    3: -3,
    4: -2,
    15: 1,
    16: 2,
    17: 3,
    18: 4,
    19: 5
}

cha_table = {
    3: [1, -30, -25],
    4: [1, -25, -20],
    5: [2, -20, -15],
    6: [2, -15, -10],
    7: [3, -10, -5],
    8: [3, -5, 0],
    9: [4, 0, 0],
    10: [4, 0, 0],
    11: [4, 0, 0],
    12: [5, 0, 0],
    13: [5, 0, 5],
    14: [6, 5, 10],
    15: [7, 15, 15],
    16: [8, 20, 25],
    17: [10, 30, 30],
    18: [15, 40, 35],
    19: [20, 50, 40]
}


class BaseMods():

    @classmethod
    def apply(cls, char: dict):
        mods_dict = dict()
        class_ = char["class"]
        race = char["race"]
        stats = char["base_stats"]
        mods_dict["str_mods"] = cls.get_str_mods(stats["str"])._asdict()
        mods_dict["dex_mods"] = cls.get_dex_mods(stats["dex"])._asdict()
        mods_dict["con_mods"] = cls.get_con_mods(stats["con"], class_)._asdict()
        mods_dict["cha_mods"] = cls.get_cha_mods(stats["cha"], )._asdict()
        mods_dict["wis_mods"] = {"mental_save": cls.get_mental_save(stats["wis"])}
        char["base_mods"] = mods_dict
        char["max_addl_langs"] = cls.get_max_addl_langs(stats["int"], race)

    @staticmethod
    def get_str_mods(score):
        mod_list = strength_table[score]
        return StrMods(*mod_list)

    @staticmethod
    def get_dex_mods(score):
        mod_list = dex_table[score]
        return DexMods(*mod_list)

    @staticmethod
    def get_con_mods(score, char_class):
        if char_class in ['fighter', 'paladin', 'ranger']:
            if score >= 17:
                table = {
                    17: [3, 98, 97],
                    18: [4, 100, 99],
                    19: [5, 100, 99],
                }
                return ConMods(*table[score])
        return ConMods(*const_table[score])

    @staticmethod
    def get_max_addl_langs(score, char_race):
        if char_race in ["elf", "human"]:
            return intel_table[score]

    @staticmethod
    def get_mental_save(score):
        if score in range(5, 8):
            return -1
        elif score in range(8, 15):
            return 0
        else:
            return wis_table[score]

    @staticmethod
    def get_cha_mods(score):
        return ChaMods(*cha_table[score])


class RaceMods():
    @classmethod
    def apply(cls, char):
        getattr(cls, char["race"].lower())(char)

    @staticmethod
    def dwarf(char: dict):
        char["base_stats"]["con"] += 1
        char["base_stats"]["cha"] -= 1
        con_mod = int(char["base_stats"]["con"]//3.5)
        char["racial_abilities"] = {
            "bonuses": {
                "base stats": "+1 constitution, -1 charisma (with respect to all but dwarfs)",
                "hit bonus": "+1 to hit against goblins, half-orcs, hobgoblins, and orcs",
                "dodge bonus": "-4 penalty to any attacks made against the dwarf by giants, ogres, ogre mages, titans and trolls.",
                "saving throw bonus": f"+{con_mod} to saves against magic and poison",
            },
            "infravision": "60 ft",
            "movement": "90 ft",
            "detect slopes or grades": "75%",
            "detect new construction": "75%",
            "detect sliding or shifting rooms or walls": "66%",
            "detect stonework traps": "50%",
            "determine depth underground": "50%",
        }
        char["languages"] = [
            "dwarfish", "gnomish", "goblin", "kobold", "orcish", "common"
        ]
        char["max_addl_langs"] = 2

    @staticmethod
    def elf(char):
        char["base_stats"]["dex"] += 1
        char["base_stats"]["con"] -= 1
        char["racial_abilities"] = {
            "bonuses": {
                "base stats": "+1 Dex, -1 Con",
                "any pulled bow": "+1 to hit",
                "longsword and short sword": "+1 to hit",
                "magic resistance": "90% resistance to sleep and charm spells"
            },
            "infravision": "60 ft",
            "movement": "120 ft",
            "secret doors": "1 in 6 chance to notice secret doors when passing within\
             10 ft, 2 in 6 chance to discover secret doors when searching, and 3 in 6 chance\
             to discover concealed doors when searching.",
            "surprise": "4 in 6 chance to surprise when travelling in non-metal armour and alone,\
             or more than 90 ft in advance of others, or with a party entirely consisting of elves\
             and/or halflings. If a door must be opened (or some similar task), the chance of\
             surprise drops to 2 in 6."
        }
        char["languages"] = [
            "common", "elven", "gnoll", "gnomish", "goblin", "halfling", "hobgoblin", "orcish"
        ]
        if char["base_stats"]["int"] >= 16:
            char["max_addl_langs"] += (char["base_stats"]["int"] - 15)

    @staticmethod
    def gnome(char):
        con_mod = int(char["base_stats"]["con"]//3.5)
        char["racial_abilities"] = {
            "bonuses": {
                "saving throw bonus": f"+{con_mod} to saves against magic and poison",
                "hit bonus": "+1 to hit kobolds and goblins",
                "dodge bonus": " -4 to attack rolls by bugbears, giants, gnolls, ogres, ogre mages, titans, and trolls."
            },
            "infravision": "60 ft",
            "movement": "90 ft",
            "chance to detect slopes or grades": "80%",
            "chance to detect unsafe wall, ceiling, floor": "70%",
            "chance to determine depth underground": "60%",
            "chance to determine direction of north underground": "50%"
        }
        char["languages"] = [
            "common", "dwarfish", "gnomish", "goblin", "halfling", "kobold", "burrowing animals"
        ]
        char["max_addl_langs"] = 2

    @staticmethod
    def half_elf(char):
        char["racial_abilities"] = {
            "bonuses": {
                "magic resistance": "30% resistance to sleep and charm spells"
            },
            "infravision": "60 ft",
            "movement": "120 ft",
            "secret doors": "When searching, a half-elf character can detect secret doors on a\
             2 in 6 and concealed doors on a 3 in 6. When passing within 10ft of a concealed door,\
             a half-elf will notice it on a 1 in 6.",
        }
        char["languages"] = [
            "common", "elven", "gnoll", "gnomish", "goblin", "halfling", "hobgoblin", "orcish"
        ]
        char["max_addl_langs"] = 2

    @staticmethod
    def halfling(char):
        char["base_stats"]["str"] -= 1
        char["base_stats"]["dex"] += 1
        con_mod = int(char["base_stats"]["con"]//3.5)
        char["racial_abilities"] = {
            "bonuses": {
                "base stats": "-1 Str, +1 Dex",
                "saving throw bonus": f"+{con_mod} to saves against magic (both aimed magic items and spells) and poison",
                "hit bonus": "+3 bonus to attacks with a bow or sling"
            },
            "infravision": "60 ft",
            "movement": "90 ft",
            "surprise": "4 in 6 chance to surprise when travelling in non-metal armour and alone,"
            " or more than 90 ft in advance of others, or with a party entirely consisting of elves"
            " and/or halflings. If a door must be opened (or some similar task), the chance of"
            " surprise drops to 2 in 6."
        }
        char["max_addl_langs"] = 2

    @staticmethod
    def half_orc(char):
        char["base_stats"]["str"] += 1
        char["base_stats"]["con"] += 1
        char["base_stats"]["cha"] -= 2
        char["racial_abilities"] = {
            "bonuses": {
                "base stats": "+1 Str and Con, -2 Cha"
            }
        }
        char["languages"] = ["common", "orcish"]
        char["max_addl_langs"] = 2

    @staticmethod
    def human(char):
        char["languages"] = ["common"]


def apply_class_mods(char_data, class_obj):
    cls_name = class_obj["name"]
    race = char_data["race"].lower().replace("-", "_")
    lvl_adv = class_obj["level_advancement"][0]
    char_data.update({
        "saving_throws": class_obj["saving_throws"]["1"],
        "ac_to_hit": class_obj["ac_to_hit"]["1"][str(char_data["ac"])],
        "class_abilities": list(filter(lambda abil: abil["level"] <= 1, class_obj["abilities"])),
        "spells_by_level": lvl_adv["spells_by_level"],
        "hit_die": class_obj["restrictions"]["hit_die"],
    })
    # Ranger and Paladin do not get spellcasting until later levels
    if cls_name in ["ranger", "paladin"]:
        char_data["spellcasting_level"] = 0

    if cls_name == "druid":
        char_data["languages"].append("druids' cant")

    if cls_name == "thief":
        char_data["languages"].append("thieves' cant")
        base_skills = class_obj["thief_skills"]["base_skill_chance"]["1"]
        dex_score = char_data["base_stats"]["dex"]
        race_adj = class_obj["thief_skills"]["race_skill_adj"][race]
        for skill in base_skills:
            base_skills[skill] += race_adj[skill]
        # dex should be at least 9 bc of minimum requirement for thief class, but check in case
        if dex_score in range(9, 20):
            dex_adj = class_obj["thief_skills"]["dex_skill_adj"][str(dex_score)]
            for skill in base_skills:
                base_skills[skill] += dex_adj[skill]
        char_data["thief_skills"] = base_skills
