#!/bin/sh

# init genesis block
geth  --datadir /home/osboxes/blockchain/PrivEth2 init genesis.json

# start node 
geth --datadir /home/osboxes/blockchain/PrivEth2 --networkid 72 --port 30301 --nodiscover
