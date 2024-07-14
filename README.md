
## Requirements:

Bitcoin Node with the following configuration (bitcoin.conf):

    #Enable RPC server
    server=1
    #Bind to the specific IP address or interface (default: 127.0.0.1)
    rpcbind=127.0.0.1
    # Allow connections from specific IP address(es) (can be repeated as needed)
    rpcallowip=192.168.1.0/24
    # RPC username and password
    rpcuser=yourrpcusername
    rpcpassword=yourrpcpassword
    # RPC port (default: 8332)
    rpcport=8332
    # Enable ZMQ publishing
     zmqpubrawblock=tcp://0.0.0.0:28332
    # Mining Optimizations**
    maxmempool=1000
    blockreconstructionextratxn=1000000
    mempoolfullrbf=1
    
## Installation and Setup

1. Run Installer .exe

2. Open settings.json in a text editor. It can be found at:

    **Windows:** %APPDATA%/public-pool-app/settings.json
   
    **macOS:** ~/Library/Application Support/public-pool-app/settings.json
   
    **Linux:** ~/.config/public-pool-app/settings.json

4. Edit settings.json to match the IP address of your Bitcoin Node, Username and password

5. Start or Restart App

## Troubbleshooting

Logs can be found at:

**Windows:** %APPDATA%/public-pool-app/logs/main.log

**macOS:** ~/Library/Logs/public-pool-app/main.log

**Linux:** ~/.config/public-pool-app/logs/main.log
