pragma solidity ^0.4.18; 

contract Betting {

  struct Game {
    bytes32 gameId;
    uint tokens;
    bool isValue;
  }

  struct Player {
    address playerAddress;
    uint issuedTokens;
    uint usedTokens;
    uint[] betsId;
  }

  mapping (address => Player) public players;
  mapping (bytes32 => Game) public games;
  bytes32[] public gamesList;

  bytes32[] public betGameId;
  address[] public betPlayerAddress;
  uint[] public betOutcome;
  uint[] public betTokens;

  uint public issuedTokens; 
  uint public usedTokens; 
  uint public tokenPrice;
  uint public numBets;

  function Betting (uint _tokenPrice, bytes32[] _gamesList) public {
    for(uint i = 0; i < _gamesList.length; i++) {
      games[_gamesList[i]].gameId = _gamesList[i];
      games[_gamesList[i]].isValue = true;
    }
    gamesList = _gamesList;
    tokenPrice = _tokenPrice;
  }

  function buy() payable public returns (uint) {
    uint tokensToBuy = msg.value / tokenPrice;
    players[msg.sender].playerAddress = msg.sender;
    players[msg.sender].issuedTokens += tokensToBuy;
    issuedTokens += tokensToBuy;
    return tokensToBuy;
  }

  function placeBet(bytes32 _gameId, uint _tokens, uint _outcome) public {
  
    require (games[_gameId].isValue);
    require ((players[msg.sender].issuedTokens - players[msg.sender].usedTokens) >= _tokens);

    betGameId.push(_gameId);
    betPlayerAddress.push(msg.sender);
    betOutcome.push(_outcome);
    betTokens.push(_tokens);

    players[msg.sender].betsId.push(betPlayerAddress.length);
    players[msg.sender].usedTokens += _tokens;
    games[_gameId].tokens += _tokens;
    usedTokens += _tokens;
    numBets++;
  }

  function getUsedTokens() view public returns (uint) {
    return usedTokens;
  }

  function getIssuedTokens() view public returns (uint) {
    return issuedTokens;
  }

  function getTokenPrice() view public returns (uint) {
    return tokenPrice;
  }

  function getPlayer(address _user) view public returns (uint, uint[]) {
    return (players[_user].issuedTokens, players[_user].betsId);
  }

  function getTokensForGame(bytes32 _gameId) view public returns (uint) {
    return games[_gameId].tokens;
  }

  function getGames() view public returns (bytes32[]) {
    return gamesList;
  }

  function getBetsPositionPlayer(uint i) view public returns (address) {
    return betPlayerAddress[i];
  }

  function getBetsPositionGame(uint i) view public returns (bytes32) {
    return betGameId[i];
  }

  function getBetsPositionOutcome(uint i) view public returns (uint) {
    return betOutcome[i];
  }

  function getBetsPositionTokens(uint i) view public returns (uint) {
    return betTokens[i];
  }

  function getNumBets() view public returns (uint) {
    return numBets;
  }

  function transferTo(address account) public {
    account.transfer(this.balance);
  }

}
