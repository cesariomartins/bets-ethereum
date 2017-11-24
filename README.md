# README #

This README would normally document whatever steps are necessary to get your application up and running.

### Test RPC - local blockchain ###

> Install
brew update
brew install nodejs
npm install ethereumjs-testrpc web3@0.20.1 solc

> Run
node_modules/.bin/testrpc

### Truffel ###

npm install -g truffle
truffle compile

> Deploy local (testRPC must be running in another terminal)
truffle migrate --network local

> Deploy testnet https://ropsten.etherscan.io/
truffle migrate --network dev

> Console
truffle console --network local

> Node web server
npm run dev




Betting.deployed().then(function(contractInstance) {contractInstance.getGames.call().then(function(v) {console.log(v)})})

Betting.deployed().then(function(contractInstance) {contractInstance.getBet.call(2).then(function(v) {console.log(v)})})