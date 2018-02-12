#!/bin/sh

# init genesis block
geth  --datadir /home/osboxes/blockchain/PrivEth4 init CustomGenesis.json

# start node 
geth --datadir /home/osboxes/blockchain/PrivEth4 --networkid 72 --port 30305 --nodiscover
