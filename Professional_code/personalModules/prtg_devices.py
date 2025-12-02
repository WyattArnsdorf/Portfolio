import requests

###############################################################
# Desc: Returns a list of device objects from PRTG
# Parameters: n/a
# Returns: data
###############################################################
def get_device_list():
    count="20000"
    url = "<url>"
    params = {
        "content": "devices",
        "count": count,
        "columns": "objid,name,group,device,sensor,status,notifiesx",
        "username": "<user>",
        "passhash": "<user_hash>"
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        print(f'success: {response.status_code}')
        data = response.json()
        return data
    else:
        print(f'response status code: {response.status_code}', response.content)
        return None