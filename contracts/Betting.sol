pragma solidity ^0.4.18; 
//pragma experimental ABIEncoderV2;

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

  struct Bet {
    bytes32 gameId;
    address playerAddress;
    uint outcome;
    uint tokens;
  }

  Bet[] public bets;
  mapping (address => Player) public players;
  mapping (bytes32 => Game) public games;
  bytes32[] public gamesList;

  uint public issuedTokens; 
  uint public usedTokens; 
  uint public tokenPrice;

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

    bets.push(Bet({
      gameId: _gameId, 
      playerAddress: msg.sender, 
      outcome: _outcome, 
      tokens:_tokens
     }));

    players[msg.sender].betsId.push(bets.length);
    players[msg.sender].usedTokens += _tokens;
    games[_gameId].tokens += _tokens;
    usedTokens += _tokens;
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

  function getBetsCount() view public returns (uint) {
    return bets.length;
  }

  function getBetAt(uint i) view public returns (bytes32, address, uint, uint) {
    return (bets[i].gameId, bets[i].playerAddress, bets[i].outcome, bets[i].tokens);
  }

  function transferTo(address account) public {
    account.transfer(this.balance);
  }

}
