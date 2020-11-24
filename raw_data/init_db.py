from pymongo import MongoClient
from csv import DictReader, DictWriter
from collections import defaultdict
from class_dicts import RESTRICTIONS_DICT, SAVING_THROWS_DICT, TO_HIT_DICT
from typing import List
from pprint import pprint


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

def init_db_classes(client, class_docs: List[dict], db="dnd_fastapi_dev", coll="classes_collection"):
    if not db or not coll:
        raise ValueError("database or collection not specified")
    db_conn = client[db][coll]
    for doc in class_docs:
        if db_conn.find_one({"name": doc["name"]}):
            print("class already exists")
            continue
        result = db_conn.insert_one(doc)
        print(result.inserted_id)


client = MongoClient('mongodb://dnd_admin:eulalia@localhost:27017/')
# db = client['dnd_fastapi']
# collection = db['classes']

docs = create_class_documents()

init_db_classes(client, docs)