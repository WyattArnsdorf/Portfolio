import json
from netmiko import ConnectHandler
from netmiko.exceptions import NetmikoTimeoutException, AuthenticationException
import time


##################################################
#
##################################################
def commit_comment(device, host, comment):
    with ConnectHandler(**device) as net_connect:
        print(f"\n-Commiting Host: {host} ---> {comment}")
        net_connect.config_mode()
        output = net_connect.commit(comment= comment)
        return output


##################################################
#
##################################################
def apply_changes(device, commands):
    with ConnectHandler(**device) as net_connect:
        net_connect.config_mode()
        net_connect.send_config_set(commands, exit_config_mode=False)
        show_compare = net_connect.send_command_timing("show | compare")
        output = net_connect.commit(confirm=True, confirm_delay=15)
        tf = True
        return output, show_compare, tf


##################################################
#
##################################################
def send_commands(device, commands):
    tf = False
    try:
        user, password = get_creds('A')
        device['username'] = user
        device['password'] = password
        output, show_compare, tf = apply_changes(device, commands)
        return output, show_compare, tf
    
    # try different set of credential if first authentication fails
    except AuthenticationException as e:
        try: 
            user, password = get_creds('B')
            device['username'] = user
            device['password'] = password
            print("Authentication failing over to alt creds")
            output, show_compare, tf = apply_changes(device, commands)
            return output, show_compare, tf
            
        # if second authentication method fails throw error
        except (AuthenticationException, NetmikoTimeoutException, Exception) as e:
            error_info = f"{type(e).__name__}: {str(e)}"
            return error_info, None, tf
        
    # If authentication never happens due to connection issue 
    except (NetmikoTimeoutException, Exception) as e:
        error_info = f"{type(e).__name__}: {str(e)}"
        return error_info, None, tf


##################################################
#
##################################################
def push_changes(operable_inv):
    start_time = time.perf_counter() 
    commands = open_file("data/commands.txt")
    count = 1
    success_inventory = []

    # Define the device parameters
    for line in operable_inv:
        parts = line.split(":")

        host = parts[0].strip()
        ip = parts[1].strip()
        
        device = {
            'device_type': 'juniper_junos',
            'host': ip
        }

        print("\n#=========================================================================================================#")
        print(f"Connection Number: {count}.")
        print(f"ssh'ing to {host}: {ip}...\n")
        output, show_compare, tf = send_commands(device, commands)
        count += 1
        
        if tf and "configuration check succeeds" in output:
            with open(f"data/changes_pushed/{host}_show_compare.txt", "w") as f:
                for compare_line in show_compare:
                    f.write(compare_line)
            print(f"-Successful Result: \n\n", f"#===#", f"\n{output}\n#===#", f"\n\n-Configuration commands pushed. Please check {host}_show_compare.txt for results")
            success_inventory.append(line)
        else:
            json_to_file(f"data/changes_pushed/failed/{host}_show_compare.txt", {"ip:": ip, "host:": host, "output:": None, "error": output})
            print(f"\n-!!! Failed Commit. Host: {host} ---> Result: ", output)
        time.sleep(3)

    end_time = time.perf_counter()
    print(f"\n-Total runtime for push_changes: {end_time - start_time:.2f} seconds")  # Print total elapsed
    return success_inventory


##################################################
#
##################################################
def confirm_commit(inventory, comment):
    count = 1
    start_time = time.perf_counter()
    for line in inventory:
        parts = line.split(":")

        host = parts[0].strip()
        ip = parts[1].strip()
        
        device = {
            'device_type': 'juniper_junos',
            'host': ip
        }
        print("\n#=========================================================================================================#")
        print(f"Commit Number: {count}")
        count += 1
        try:
            user, password = get_creds('A')
            device['username'] = user
            device['password'] = password
            output = commit_comment(device, host, comment)

        # try different set of credential if first authentication fails
        except AuthenticationException as e:
            try: 
                user, password = get_creds('B')
                device['username'] = user
                device['password'] = password
                print("Authentication failing over to alt creds")
                output = commit_comment(device, host, comment)

            # if second authentication method fails throw error
            except (AuthenticationException, NetmikoTimeoutException, Exception) as e:
                output = f"{type(e).__name__}: {str(e)}"

        # If authentication never happens due to connection issue 
        except (NetmikoTimeoutException, Exception) as e:
            output = f"{type(e).__name__}: {str(e)}"

        print(f"\n-Output: \n\n", f"#===#", f"\n{output}\n#===#")
        time.sleep(3)
    end_time = time.perf_counter()
    print(f"\n-Total runtime for confirm_commit: {end_time - start_time:.2f} seconds")  # Print total elapsed


##################################################
#
##################################################
def get_creds(creds):
    if 'A' in creds:
        lines = open_file('inventory/creds1.txt')
    elif 'B' in creds:
        lines = open_file('inventory/creds2.txt')
    
    user = lines[0].strip()
    password = lines[1].strip()

    return user, password


##################################################
#
##################################################
def open_file(file_path):
    with open(file_path, "r") as file:
        file_data = file.readlines()
    
    return file_data


##################################################
#
##################################################
def json_to_file(file_path, data):
    with open(file_path, "w") as file:
        json.dump(data, file, indent=2)
        print("response written to output.txt")


def main():
    start_time = time.perf_counter() 
    comment = "Updated firewall/policy-options -user/ansible"
    operable_inv = open_file("inventory/south_fragmented/south_inventory_4.txt")
    #operable_inv = open_file("inventory/test_inventory.txt")
    
    print("\n######################################################_Pushing configuration changes_#######################################################\n")
    success_inventory = push_changes(operable_inv)
    
    print("\n\n###############################################_Please review push results before commit sequence_########################################") 
    print("\nWaiting for 45 seconds...\n\n")
    time.sleep(45)

    confirm_commit(success_inventory, comment)
    
    end_time = time.perf_counter()
    print(f"\n-Total runtime for entire operation {end_time - start_time:.2f} seconds")  # Print total elapsed


if __name__ == '__main__':
    main()