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

# TODO: create a class or better organize/modularize init_db functions

classes = ["assassin", "cleric", "druid", "fighter", "illusionist",
           "magic_user", "thief", "paladin", "ranger"]


def rec_dd():
    """Recursive defaultdict for nested structures"""
    return defaultdict(rec_dd)


def create_class_documents():
    documents = []
    for c in classes:
        lvl_adv_reader = DictReader(open('level_advancement.csv', 'r'))
        abilities_reader = DictReader(open('class_abilities.csv', 'r'))
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
            base_skill_reader = DictReader(open('thief_skills_base_chance.csv'))
            dex_adj_reader = DictReader(open('thief_skills_dex_adj.csv'))
            race_adj_reader = DictReader(open('thief_skills_race_adj.csv'))
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


def init_db_classes(client, class_docs: List[dict], db="dnd_fastapi_dev", coll="classes_collection"):
    if not db or not coll:
        raise ValueError("database or collection not specified")
    db_conn = client[db][coll]
    for doc in class_docs:
        if db_conn.find_one({"name": doc["name"]}):
            print("class already exists")
            continue
        db_conn.insert_one(doc)


def init_db_spells(client, spell_csv: str, db="dnd_fastapi_dev", coll="spell_collection"):
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

def init_db_races(client, race_csv_file, db="dnd_fastapi_dev", coll="race_collection"):
    db_conn = client[db][coll]
    reader = DictReader(open(race_csv_file))
    for row in reader:
        row["languages"] = list(map(lambda s: s.replace('_', ' '), row["languages"].split()))
        row["permitted_classes"] = row["permitted_classes"].split()
        row["abilities"] = json.loads(row["abilities"])
        row["sizes"] = json.loads(row["sizes"])
        row["starting_ages"] = json.loads(row["starting_ages"])
        db_conn.insert_one(row)

def init_db_inventory(client, db='dnd_fastapi_dev', items_csv='items.csv', armor_csv='armor.csv',
                      weapons_csv='weapons.csv'):
    item_coll = client[db]["item_collection"]
    item_reader = DictReader(open(items_csv))
    for row in item_reader:
        item_coll.insert_one(row)

    armor_coll = client[db]["armor_collection"]
    armor_reader = DictReader(open(armor_csv))
    for row in armor_reader:
        armor_coll.insert_one(row)

    weapons_coll = client[db]["weapons_collection"]
    weapons_reader = DictReader(open(weapons_csv))
    for row in weapons_reader:
        weapons_coll.insert_one(row)


if __name__ == "__main__":
    args = sys.argv[1:]
    client = MongoClient('mongodb://dnd_admin:eulalia@localhost:27017/')
    # db = client['dnd_fastapi']
    # collection = db['classes']

    if "classes" in args:
        docs = create_class_documents()
        init_db_classes(client, docs)

    if "spells" in args:
        init_db_spells(client, 'all_spells.csv')

    if "races" in args:
        init_db_races(client, 'race_data.csv')

    if "equipment" in args:
        init_db_inventory(client)
