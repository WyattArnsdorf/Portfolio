
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
        device['username'] = '<user1>'
        device['password'] = '<password1>'
        output, tf = establish_connection(device, command)
        return output, tf
    
    # try different set of credential if first authentication fails
    except AuthenticationException as e:
        try: 
            device['username'] = '<user2>'
            device['password'] = '<password2>'
            print("Authentication failing over to alt creds")
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


def find_devices(inventory_file):
    results = []
    with open(inventory_file, "r") as file:
        inventory = file.readlines()
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

        command = "show configuration system host-name"
        print("\n#==========================================#")
        print(f"Connection Number: {count}.")
        print(f"ssh'ing to {host}: {ip}...")
        output, tf = send_command(device, command)
        print("Result:", output)
        count += 1
        if tf:
            results.append({'ip': ip, 'host:': host, 'output': output, 'error': None})
        else:
            results.append({'ip': ip, 'host:': host, 'output': None, 'error': output})

    return results
        

def make_inventory(results):
    contactable = []
    non_contactable = []
    for entry in results:
        if entry["error"]:
            non_contactable.append(entry)
        else:
            contactable.append(entry)

    with open("data/non_contactable.txt", "w") as file1:
        json.dump(non_contactable, file1, indent=2)
        print("response written to non_contactable.txt")
    
    with open("data/contactable.txt", "w") as file2:
        json.dump(contactable, file2, indent=2)
        print("response written to contactable.txt")


def main():
    results = find_devices("inventory/test_inventory.txt")
    make_inventory(results)


if __name__ == '__main__':
    main()