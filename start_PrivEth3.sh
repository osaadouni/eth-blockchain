#!/bin/sh

# init genesis block
geth  --datadir /home/osboxes/blockchain/PrivEth3 init CustomGenesis.json

# start node 
geth --datadir /home/osboxes/blockchain/PrivEth3 --networkid 72 --port 30304 --nodiscover
