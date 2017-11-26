var Betting = artifacts.require("./Betting.sol");

module.exports = function(deployer) {
 deployer.deploy(Betting, ['a-b', 'a-c', 'b-c'], {gas: 4700000});
};