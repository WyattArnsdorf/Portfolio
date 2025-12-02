import json
import pandas as pd


###############################################################
# Desc: Takes a JSON file and exports the data to a .csv file
# Parameters: file_path
# Returns: n/a
###############################################################
def json_file_to_csv(json_file_path, csv_file_path):
    # Load JSON data
    with open(json_file_path) as f:
        data = json.load(f)

    # Flatten nested JSON
    df = pd.json_normalize(data)

    # Export to CSV
    df.to_csv(csv_file_path, index=False)


###############################################################
# Desc: Takes JSON data and outputs it to the provided file/file-path
# Parameters: file_path, data
# Returns: n/a
###############################################################
def json_to_file(file_path, data):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)
