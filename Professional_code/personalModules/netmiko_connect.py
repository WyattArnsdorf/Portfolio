from netmiko import ConnectHandler
from netmiko.exceptions import NetmikoTimeoutException, AuthenticationException


###############################################################
# Desc: Returns the output from the contacted device
# Parameters: device, command
# Returns: output/error_info, boolean
###############################################################
def send_command(device, command):
    try: 
        with ConnectHandler(**device) as net_connect:
            output = net_connect.send_command(command)
        
        return output, True
            
    # if connection throws an error
    except (AuthenticationException, NetmikoTimeoutException, Exception) as e:
        return e, False