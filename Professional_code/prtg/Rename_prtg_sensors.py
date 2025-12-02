import requests
import time
import xml.etree.ElementTree as ET
from xml.dom import minidom

##################################################################
#
#
#
##################################################################
def get_all_sensors():
    count="20000"
    url = "<url>"
    params = {
        "content": "sensors",
        "count": count,
        "columns": "objid,name,group,device,sensor,status,notifiesx",
        "username": "<user>",
        "passhash": "<user_hash>"
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        print(f'success: {response.status_code}')
        root = ET.fromstring(response.content)
        return root
    else:
        print(f'response status code: {response.status_code}', response.content)


##################################################################
#
#
#
##################################################################
def organize_sensors(group_substr, name_substr, file):
    #Full Sensor List
    full_tree = ET.parse(file)
    full_tree_root = full_tree.getroot()

    #Root for Huawei's and the sensors in a group
    huaweis_in_group = ET.Element('sensors')
    sensors_by_group = ET.Element('sensors')

    #Variables
    total_sensors_by_group = 0
    total_sensors_by_name = 0
    i = 0
    #XML element fields
    sensor_items = ['objid', 'name', 'group', 'device', 'sensor', 'status', 'status_raw', 'notifiesx']
    #Finds all item elements from entire sensor list matching it based on group criteria
    for item in full_tree_root.findall('item'):
        items_name = item.find('name')
        items_group = item.find('group')

        if group_substr in items_group.text:
            total_sensors_by_group += 1
            new_group_item = ET.SubElement(sensors_by_group, 'item')
            for field in sensor_items:
                elem = item.find(field)
                ET.SubElement(new_group_item, field).text = elem.text
            #Filters if this group element also contains the substring search criteria
            if name_substr in items_name.text:
                total_sensors_by_name += 1
                new_name_item = ET.SubElement(huaweis_in_group, 'item')
                for field in sensor_items:
                    elem = item.find(field)
                    ET.SubElement(new_name_item, field).text = elem.text

    return sensors_by_group, huaweis_in_group


##################################################################
#
#
#
##################################################################
def output_to_xml_file(sensors, file):
    total_count = ET.SubElement(sensors, 'total_count')
    total_count.text = str(len(sensors) - 1)

    xml_str = ET.tostring(sensors, encoding='UTF-8')
    dom = minidom.parseString(xml_str)
    pretty_xml = dom.toprettyxml(indent='  ')

    #Organize new xml sensor list
    with open(file, 'w') as f:
        f.write(pretty_xml)


##################################################################
#
#
#
##################################################################
def rename(filtered_sensors, old_substr, new_substr):
    root = ET.Element('sensors')
    sensor_items = ['objid', 'name', 'group', 'device', 'sensor', 'status', 'status_raw', 'notifiesx']
    for item in filtered_sensors.findall('item'):
        new_item = ET.SubElement(root, 'item')
        for field in sensor_items:
            elem = item.find(field)
            if field == 'name':
                old_name = elem.text
                new_name = old_name.replace(old_substr, new_substr)
                ET.SubElement(new_item, field).text = old_name
                ET.SubElement(new_item, 'new_name').text = new_name
            else:
                ET.SubElement(new_item, field).text = elem.text

    return root

##################################################################
#
#
#
##################################################################
def push_api(request_root):
    url = "<url>"
    i = 0

    for item in request_root:
        objid_elem = item.find('objid')
        new_name_elem = item.find('new_name')

#        print(f"{objid_elem.tag}: {objid_elem.text}")
#        print(f"{new_name_elem.tag}: {new_name_elem.text}")
        params = {
            'id': objid_elem.text,
            'value': new_name_elem.text,
            "username": "<user>",
            "passhash": "<user_hash>"
        }

        max_retries = 5
        attempt = 0

        while attempt < max_retries:
            try:
                response = requests.get(url, params=params, timeout=20)
                response.raise_for_status()
                print(f"Success: {response.status_code} - {response.text} - {objid_elem.text} - {new_name_elem.text}")
                i += 1
                print(i)
                break
            except requests.RequestException as e:
                attempt += 1
                print(f"HTTP error for objid {objid_elem}: {e}")
                print(f" - {response.status_code} - {response.text}")
                print(f"Retrying in 5 seconds... (Attempt {attempt}/{max_retries})")
                time.sleep(5)
        else:
            print(f"Failed to update sensor {objid_elem} after {max_retries} attempts.")

        time.sleep(1)

##################################################################
#
#
#
##################################################################
def main():
    date = '6-16-25'
    file = f'{date}/all_sensors_{date}.xml'
#    sensors = get_all_sensors()
#    output_to_xml_file(sensors, file)

    #Variables
    group_substr = '10.10.10.0/24'
    old_substr = 'S5320'
    new_substr = '4300'

    filtered_group, filtered_sensors = organize_sensors(group_substr, old_substr, file)

#    output_to_xml_file(filtered_group, f'{date}/filtered_group_{date}.xml')
#    output_to_xml_file(filtered_sensors, f'{date}/filtered_sensors_{date}.xml')

    sensor_request = rename(filtered_sensors, old_substr, new_substr)
    output_to_xml_file(sensor_request, f'{date}/sensors_changed_{date}.xml')
#    push_api(sensor_request)


if __name__ == '__main__':
    main()