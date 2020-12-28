from pymongo import MongoClient
import json
from csv import DictReader
from typing import List
from collections import defaultdict
from class_dicts import (
    RESTRICTIONS_DICT, SAVING_THROWS_DICT, TO_HIT_DICT, SUMMARIES
)
from typing import List
from pprint import pprint
import sys

""" To Do:
    -Add option to create test users and characters upon build
    -Add in error handler for missing files
    -Add a health check to make sure db is totally up and running after build
    """

classes = ["assassin", "cleric", "druid", "fighter", "illusionist",
           "magic_user", "thief", "paladin", "ranger"]


def rec_dd():
    """Recursive defaultdict for nested structures"""
    return defaultdict(rec_dd)


def create_class_documents():
    documents = []
    for c in classes:
        lvl_adv_reader = DictReader(open('data/level_advancement.csv', 'r'))
        abilities_reader = DictReader(open('data/class_abilities.csv', 'r'))
        document = defaultdict(rec_dd)
        document.update({
            "name": c,
            "summary": SUMMARIES[c],
            "restrictions": RESTRICTIONS_DICT[c],
            "saving_throws": SAVING_THROWS_DICT[c],
            "ac_to_hit": TO_HIT_DICT[c],
            # filter and add abilities from csv file
            "abilities": [
                {"level": int(row["level"]), "ability": row["ability"], "description": row["description"]}
                for row in abilities_reader if row["class"] == c],
            "level_advancement": [],
        })

        # Create level advancement document
        csv_lvl_adv = [row for row in lvl_adv_reader if row["class"] == c]
        for row in csv_lvl_adv:
            level_adv_embedded_document = {
                "level": int(row["level"]),
                "exp": int(row["exp"].replace(',', '')),
                "hit_dice": (row["hit_dice"]),
                "notes": row["notes"],
                "spells_by_level": None,
            }
            # Spellcasters gain spell slots per level
            if c in ["cleric", "druid", "illusionist"]:
                level_adv_embedded_document["spells_by_level"] = {
                    str(i): int(row[f"s{i}"]) for i in range(1, 8)
                }
            # Magic users have 10 levels of spells/slots
            elif c == "magic_user":
                level_adv_embedded_document["spells_by_level"] = {
                    str(i): int(row[f"s{i}"]) for i in range(1, 10)
                }
            # Rangers can use Druid and/or Mage spells after level 8-9
            elif c == "ranger":
                level_adv_embedded_document["spellcasting_level"] = int(row["ranger_spell_casting_lvl"])
                level_adv_embedded_document["spells_by_level"] = {
                    "druid_spells": {
                        str(i): int(row[f"rng_d{i}"]) for i in range(1, 4)
                    },
                    "mage_spells": {
                        str(i): int(row[f"rng_m{i}"]) for i in range(1, 3)
                    }
                }
            # Paladins can cast Cleric spells after 9th level
            elif c == "paladin":
                level_adv_embedded_document["spellcasting_level"] = row["paladin_cleric_sp_lvl"]
                level_adv_embedded_document["spells_by_level"] = {
                    str(i): int(row[f"p{i}"]) for i in range(1, 5)
                }
            document["level_advancement"].append(level_adv_embedded_document)

        # Thiefs skill tables with chance of success (%)
        if c == "thief":
            base_skill_reader = DictReader(open('data/thief_skills_base_chance.csv'))
            dex_adj_reader = DictReader(open('data/thief_skills_dex_adj.csv'))
            race_adj_reader = DictReader(open('data/thief_skills_race_adj.csv'))
            document["thief_skills"] = {
                "base_skill_chance": dict(),
                "dex_skill_adj": dict(),
                "race_skill_adj": dict(),
            }
            # Base skill chance table
            for row in base_skill_reader:
                document["thief_skills"]["base_skill_chance"][row["level"]] = {
                    h: float(row[h])
                    for h in base_skill_reader.fieldnames[1:]
                }
            # Dex adjustments table
            for row in dex_adj_reader:
                document["thief_skills"]["dex_skill_adj"][row["dexterity"]] = {
                    h: float(row[h])
                    for h in dex_adj_reader.fieldnames[1:]
                }
            # Race adjustments table
            for row in race_adj_reader:
                document["thief_skills"]["race_skill_adj"][row["race"]] = {
                    h: float(row[h])
                    for h in race_adj_reader.fieldnames[1:]
                }

        documents.append(document)

    return documents

def parse_embedded_tables(cell_data: str) -> List[dict]:
    """Parse tables that use `$`, `:`, `|`, and `@` as delimiters in the csv file"""
    raw_tables = list(filter(lambda tbl: tbl != '', cell_data.split('@')))
    tables = []
    for table in raw_tables:
        doc = {
            "title": '',
            "headers": [],
            "rows": []
        }
        table = table.strip()
        lines = table.splitlines()

        top_row = lines.pop(0).split(':')
        doc["title"] = top_row[0].lstrip('$')
        doc["headers"] = top_row[1].split('|')

        for row in lines:
            doc["rows"].append(row.split('|'))
        tables.append(doc)

    return tables


def init_db_classes(client, db="dnd_fastapi_dev", coll="classes_collection"):
    if not db or not coll:
        raise ValueError("database or collection not specified")
    db_conn = client[db][coll]
    class_docs = create_class_documents()
    for doc in class_docs:
        if db_conn.find_one({"name": doc["name"]}):
            print("class already exists")
            continue
        db_conn.insert_one(doc)


def init_db_spells(client, db="dnd_fastapi_dev", spell_csv='data/all_spells.csv', coll="spell_collection"):
    if not db or not coll:
        raise ValueError("database or collection not specified")
    db_conn = client[db][coll]
    reader = DictReader(open(spell_csv))
    for row in reader:
        row["components"] = row["components"].split()
        if not row["embedded_tables"]:
            row["embedded_tables"] = None
        else:
            row["embedded_tables"] = parse_embedded_tables(row["embedded_tables"])
        # TODO: finish transposing spell data from OSRIC PDF for other classes
        if row["class"] in ["cleric", "druid"]:
            db_conn.insert_one(row)

def init_db_races(client, db="dnd_fastapi_dev", race_csv_file='data/race_data.csv', coll="race_collection"):
    db_conn = client[db][coll]
    reader = DictReader(open(race_csv_file))
    for row in reader:
        row["languages"] = list(map(lambda s: s.replace('_', ' '), row["languages"].split()))
        row["permitted_classes"] = row["permitted_classes"].split()
        row["abilities"] = json.loads(row["abilities"])
        row["sizes"] = json.loads(row["sizes"])
        row["starting_ages"] = json.loads(row["starting_ages"])
        db_conn.insert_one(row)

def init_db_inventory(client, db='dnd_fastapi_dev', items_csv='data/items.csv', armor_csv='data/armor.csv', weapons_csv='data/weapons.csv'):
    init_db_weapons(client)
    init_db_armor(client)
    init_db_items(client)

def init_db_weapons(client, db='dnd_fastapi_dev', weapons_csv='data/weapons.csv'):
    weapons_coll = client[db]["weapons_collection"]
    weapons_reader = DictReader(open(weapons_csv))
    for row in weapons_reader:
        document = {
            "name": row["name"],
            "dmg_sm_md": row["dmg_sm_md"],
            "dmg_lg": row["dmg_lg"],
            "encumbrance": row["encumbrance"],
            "cost": {
                "gp": int(row["gp"]),
                "sp": int(row["sp"]),
                "cp": int(row["cp"]),
                "ep": 0,
                "pp": 0,
                "amtPer": int(row["amt_per"]),
            },
            "category": row["category"],
            "sub_category": row["sub_category"],
            "type": row["type"],
            "rate_of_fire": row["rate_of_fire"],
            "range": row["range"]
        }
        weapons_coll.insert_one(document)

def init_db_armor(client, db='dnd_fastapi_dev', armor_csv='data/armor.csv'):
    armor_coll = client[db]["armor_collection"]
    armor_reader = DictReader(open(armor_csv))
    for row in armor_reader:
        document = {
            "name": row["name"],
            "encumbrance": row["encumbrance"],
            "cost": {
                "gp": int(row["gp"]),
                "sp": int(row["sp"]),
                "cp": int(row["cp"]),
                "ep": 0,
                "pp": 0,
                "amtPer": 1,
            },
            "max_move": row["max_move"],
            "ac": row["ac"],
        }
        armor_coll.insert_one(document)

def init_db_items(client, db='dnd_fastapi_dev', items_csv='data/items.csv'):
    items_coll = client[db]["items_collection"]
    items_reader = DictReader(open(items_csv))
    for row in items_reader:
        document = {
            "name": row["name"],
            "encumbrance": row["encumbrance"],
            "cost": {
                "gp": int(row["gp"]),
                "sp": int(row["sp"]),
                "cp": int(row["cp"]),
                "ep": 0,
                "pp": 0,
                "amtPer": 1,
            },
        }
        items_coll.insert_one(document)

def build_db_collections(client, args=['build','all']):
    """Making a function to build all or some of the collections in DnDdb"""
    """Expecting an array like this:
        ['build', 'all'] or ['build', 'races', 'weapons', etc]"""
    """Would be good to put these in a meaningful order"""
    build_all_flag = False

    if args[1].lower() == 'all':
        print("Building all collections")
        build_all_flag = True

    if "classes" in args or build_all_flag:
        print("Building Classes")
        init_db_classes(client)
    
    if "spells" in args or build_all_flag:
        print("Building Spells")
        init_db_spells(client)

    if "races" in args or build_all_flag:
        print("Building Races")
        init_db_races(client)

    if "equipment" in args or build_all_flag:
        print("Building Equipment (weapons, armor and items)")
        init_db_inventory(client)

    if "weapons" in args or build_all_flag:
        print("Building Weapons")
        init_db_weapons(client)

    if "armor" in args or build_all_flag:
        print("Building Armor")
        init_db_armor(client)

    if "items" in args or build_all_flag:
        print("Building Items")
        init_db_items(client)

def delete_db_collections(client, args=['delete', 'all'],db='dnd_fastapi_dev'):
    """Here I'm going to make cmds to delete all or some of the database 'collections'"""
    """Would be good to put these in a meaningful order"""

    if args[1].lower() == 'all':
        print(f"Deleting contents of {db}!")
        outcome = db.dropDatabase()
        if outcome:
            print("Database delete successful")
        else:
            print("Ruh-ruh, can't even delete a database correct")
        return

    if "classes" in args:
        print("Deleting Classes")
        my_coll = client[db]["classes_collection"]
        my_coll.drop()
    
    if "spells" in args:
        print("Deleting Spells")
        my_coll = client[db]["spell_collection"]
        my_coll.drop()
    
    if "races" in args:
        print("Deleting Races")
        my_coll = client[db]["race_collection"]
        my_coll.drop()

    if "equipment" in args:
        print("Deleting all Equipment (weapons, armor and items)")
        my_coll = client[db]["weapons_collection"]
        my_coll.drop()
        my_coll = client[db]["armor_collection"]
        my_coll.drop()
        my_coll = client[db]["items_collection"]
        my_coll.drop()
        
    if "weapons" in args:
        print("Deleting Weapons")
        my_coll = client[db]["weapons_collection"]
        my_coll.drop()
    
    if "armor" in args:
        print("Deleting Armor")
        my_coll = client[db]["armor_collection"]
        my_coll.drop()

    if "items" in args:
        print("Deleting Items")
        my_coll = client[db]["items_collection"]
        my_coll.drop()



if __name__ == "__main__":
    args = sys.argv[1:]
    client = MongoClient('mongodb://dnd_admin:eulalia@localhost:27017/')
    build_all_flag = False
    # db = client['dnd_fastapi']
    # collection = db['classes']

    if args[0].lower() == 'build':
        build_db_collections(client, args)
    elif args[0].lower() == 'delete':
        delete_db_collections(client, args)

