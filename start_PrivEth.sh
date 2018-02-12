#!/bin/sh

# init genesis block
geth  --datadir /home/osboxes/blockchain/PrivEth init genesis.json

# start node 
geth --datadir /home/osboxes/blockchain/PrivEth --networkid 72 --port 30301 --nodiscover
