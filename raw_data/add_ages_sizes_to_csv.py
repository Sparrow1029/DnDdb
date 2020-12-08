from csv import DictReader, DictWriter
import json

sizes = json.load(open('sizes.json'))['sizes']
ages = json.load(open('starting_ages.json'))['ages']

reader = DictReader(open('race_data.csv'))
writer = DictWriter(open('race_data_new.csv', 'w+'), fieldnames=reader.fieldnames)
writer.writeheader()
for row in reader:
    row["sizes"] = json.dumps(sizes[row["name"]])
    row["starting_ages"] = json.dumps(ages[row["name"]])
    writer.writerow(row)

