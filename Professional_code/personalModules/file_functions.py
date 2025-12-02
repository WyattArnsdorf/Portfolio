import json
import pandas as pd

##############################################################################_Write Functions_###########################################################################

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
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

    print(f"Response written to {file_path}\n")


##################################################################
# Desc: Takes a string and outputs it to the provided file/file-path
# Parameters: file_path, data
# Returns: n/a
################################################################## 
def string_to_file(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(data)

    print(f"Response written to {file_path}\n")


##################################################################
# Desc: Outputs xml data to a specified file
# Parameters: file_path, data
# Returns: n/a
##################################################################
def xml_to_file(file_path, data):
    data.write(file_path, encoding='utf-8', xml_declaration=True)

    print(f"Response written to {file_path}\n")


##############################################################################_Read Functions_###########################################################################

##################################################################
# Desc: Opens a file and returns the json data
# Parameters: file_path
# Returns: data
################################################################## 
def open_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)

    return data


##################################################################
# Desc: Opens a file and returns the json data
# Parameters: file_path
# Returns: data
################################################################## 
def open_file(file_path):
    with open(file_path, 'r') as file:
        data = file.readlines()

    return data

