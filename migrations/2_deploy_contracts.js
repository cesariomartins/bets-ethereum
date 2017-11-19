var Betting = artifacts.require("./Betting.sol");

module.exports = function(deployer) {
 deployer.deploy(Betting, web3.toWei('0.01', 'ether'), ['a-b', 'a-c', 'b-c'], {gas: 4700000});
};