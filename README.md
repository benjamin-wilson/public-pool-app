## Requirements:

Bitcoin Node with the following configuration:

**#Enable RPC server**

    server=1

 **#Bind to the specific IP address or interface (default: 127.0.0.1)**

    rpcbind=127.0.0.1

**# Allow connections from specific IP address(es) (can be repeated as needed)**

    rpcallowip=192.168.1.0/24

**# RPC username and password**

    rpcuser=yourrpcusername
    rpcpassword=yourrpcpassword

**# RPC port (default: 8332)**

    rpcport=8332
 **# Enable ZMQ publishing**

     zmqpubrawblock=tcp://0.0.0.0:28332

 **# Mining Optimizations**

    maxmempool=1000
    blockreconstructionextratxn=1000000
    mempoolfullrbf=1

    
## Installation and Setup

1. Run Installer .exe

2. Navigate to C:\Users\username\AppData\Local\public_pool_app\app-1.0.0\resources

3. Edit settings.json to match the IP address of your Bitcoin Node, Username and password

4. Start or Restart App
