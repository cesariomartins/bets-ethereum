# README #

This README would normally document whatever steps are necessary to get your application up and running.

### Test RPC - local blockchain ###

brew update

brew install nodejs

npm install ethereumjs-testrpc web3@0.20.1 solc

node_modules/.bin/testrpc

### Truffel ###

npm install -g truffle
truffle compile

> Deploy local (testRPC must be running in another terminal)
truffle migrate --network local

> Deploy testnet https://ropsten.etherscan.io/
truffle migrate --network dev

> Node web server
npm run dev




