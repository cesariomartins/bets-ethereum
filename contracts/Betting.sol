pragma solidity ^0.4.18; 
//pragma experimental ABIEncoderV2;

contract Betting {

  struct Match {
    bytes32 matchId;
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
    uint betId;
    uint timestamp;
    bytes32 matchId;
    address playerAddress;
    uint outcome;
    uint amount;
  }

  event NewBet (
    uint _betId,
    uint _timestamp,
    bytes32 _matchId,
    address _playerAddress,
    uint _outcome,
    uint _amount
  );

  Bet[] public bets;
  mapping (address => Player) public players;
  mapping (bytes32 => Match) public matches;
  bytes32[] public matchesList;

  uint public issuedTokens; 
  uint public usedTokens; 
  uint public tokenPrice;

  function Betting (uint _tokenPrice, bytes32[] _matchesList) public {
    for(uint i = 0; i < _matchesList.length; i++) {
      matches[_matchesList[i]].matchId = _matchesList[i];
      matches[_matchesList[i]].isValue = true;
    }
    matchesList = _matchesList;
    tokenPrice = _tokenPrice;
  }

  function buy() payable public returns (uint) {
    uint tokensToBuy = msg.value / tokenPrice;
    players[msg.sender].playerAddress = msg.sender;
    players[msg.sender].issuedTokens += tokensToBuy;
    issuedTokens += tokensToBuy;
    return tokensToBuy;
  }

  function placeBet(bytes32 _matchId, uint _amount, uint _outcome) public {
  
    require (matches[_matchId].isValue);
    require ((players[msg.sender].issuedTokens - players[msg.sender].usedTokens) >= _amount);

    Bet memory b = Bet({
      betId: bets.length,
      timestamp: block.timestamp,
      matchId: _matchId, 
      playerAddress: msg.sender, 
      outcome: _outcome, 
      amount: _amount
     });

    bets.push(b);

    players[msg.sender].betsId.push(bets.length);
    players[msg.sender].usedTokens += _amount;
    matches[_matchId].tokens += _amount;
    usedTokens += _amount;

    NewBet(b.betId, b.timestamp, b.matchId, b.playerAddress, b.outcome, b.amount);
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

  function getTokensForMatch(bytes32 _matchId) view public returns (uint) {
    return matches[_matchId].tokens;
  }

  function getMatches() view public returns (bytes32[]) {
    return matchesList;
  }

  function getBetsCount() view public returns (uint) {
    return bets.length;
  }

  function getBetAt(uint i) view public returns (bytes32, address, uint, uint) {
    return (bets[i].matchId, bets[i].playerAddress, bets[i].outcome, bets[i].amount);
  }

  function transferTo(address account) public {
    account.transfer(this.balance);
  }

}
