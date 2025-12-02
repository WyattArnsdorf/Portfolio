import output_functions as of
import time
import json
from netmiko import ConnectHandler
from netmiko.exceptions import NetmikoTimeoutException, AuthenticationException


def establish_connection(device, command):
    with ConnectHandler(**device) as net_connect:
        output = net_connect.send_command(command)
        tf = True
        return output, tf


def send_command(device, command):
    tf = False
    try:
        device['username'] = '<username_1>'
        device['password'] = '<password_1>'
        output, tf = establish_connection(device, command)
        return output, tf
    
    # try different set of credential if first authentication fails
    except AuthenticationException as e:
        try: 
            device['username'] = '<username_2>'
            device['password'] = '<username_2>'
            print("Authentication failing over to alt credentials")
            output, tf = establish_connection(device, command)
            return output, tf
            
        # if second authentication method fails throw error
        except (AuthenticationException, NetmikoTimeoutException, Exception) as e:
            error_info = f"{type(e).__name__}: {str(e)}"
            return error_info,tf
        
    # If authentication never happens due to connection issue 
    except (NetmikoTimeoutException, Exception) as e:
        error_info = f"{type(e).__name__}: {str(e)}"
        return error_info, tf


def find_4300s(inventory_file, command):
    results = []
    with open(inventory_file, "r") as file:
        inventory = file.readlines()
    
    total_lines = len(inventory)
    count = 1
    # Define the device parameters
    for line in inventory:
        parts = line.split(":")

        host = parts[0].strip()
        ip = parts[1].strip()
        
        device = {
            'device_type': 'juniper_junos',
            'host': ip
        }

        print("\n#==========================================#")
        print(f"Connection Number: {count} out of {total_lines}.")
        print(f"ssh'ing to {host}: {ip}...")
        output, tf = send_command(device, command)
        count += 1
        if tf:
            results.append({'ip': ip, 'host:': host, 'output': output, 'error': "N/A"})
        else:
            results.append({'ip': ip, 'host:': host, 'output': None, 'error': output})

    return results


def add_serial_column(hardware_output, json_output):
    serial_nums = []
    for obj in json_output:
        output = obj.get("output")
        if output is None:
            serial_nums.append(None)
            continue
        try:
            output_dict = json.loads(output)
            serial_num = output_dict["chassis-inventory"][0]["chassis"][0]["serial-number"][0]["data"]
        except (json.JSONDecodeError, KeyError, IndexError, TypeError):
            serial_num = None
        serial_nums.append(serial_num)

    result = []
    for chassis, serial in zip(hardware_output, serial_nums):
        chassis["serial"] = serial
        result.append(chassis)

    return result    


def main():
    start_time = time.perf_counter() 
    display_json = "show chassis hardware | display json"
    chassis_hardware = "show chassis hardware"
    json_output = find_4300s("data/south_inventory.txt", display_json)
    hardware_output = find_4300s("data/south_inventory.txt", chassis_hardware)

    results = add_serial_column(hardware_output, json_output)

    file_path = "data/responses.json"

    of.json_to_file(file_path, results)
    print(f"\nResults found in {file_path}")
    
    of.json_file_to_csv('data/responses.json', 'data/output.csv')

    print("\n#==========================================#")
    print("\nFinished Querying Inventory.\n")
    end_time = time.perf_counter()
    print(f"\n-Total runtime for entire operation {end_time - start_time:.2f} seconds")


if __name__ == '__main__':
    main()