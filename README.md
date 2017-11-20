### Setup: Ethereum RPC local env

```bash
brew update
brew install nodejs

#using npm
npm install ethereumjs-testrpc web3@0.20.1 solc
node_modules/.bin/testrpc

#alternatively, using yarn
yarn add ethereumjs-testrpc web3@0.20.1 solc

#bonus: https://web3js.readthedocs.io/en/1.0/web3-utils.html
yarn add web3-utils

#why web3@0.20.1? because web3 is not working
#see https://github.com/ethereum/web3.js/issues/1070

#check if it is working by running:
node_modules/.bin/testrpc
```

#### Setup: Truffle

```bash
#using npm
npm install -g truffle
truffle compile

#using yarn (locally)
yarn add truffle
node_modules/.bin/truffle compile

#deploy locally (testRPC must be running in another terminal)
truffle migrate --network local

#deploy to testnet https://ropsten.etherscan.io/
truffle migrate --network dev

#run node web server
npm run dev
yarn run dev
```
