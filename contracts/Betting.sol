pragma solidity ^0.4.18; 
//pragma experimental ABIEncoderV2;

contract Betting {

  struct Match {
    bytes32 matchId;
    uint betAmount;
    bool isValue;
  }

  struct Player {
    address playerAddress;
    uint betAmount;
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
  uint public totalBetAmount;

  address owner;

  function Betting (bytes32[] _matchesList) public {
    owner = msg.sender;
    for(uint i = 0; i < _matchesList.length; i++) {
      matches[_matchesList[i]].matchId = _matchesList[i];
      matches[_matchesList[i]].isValue = true;
    }
    matchesList = _matchesList;
  }

  function placeBet (bytes32 _matchId, uint _outcome) payable public {
    require (matches[_matchId].isValue);

    Bet memory b = Bet({
      betId: bets.length,
      timestamp: block.timestamp,
      matchId: _matchId, 
      playerAddress: msg.sender, 
      outcome: _outcome, 
      amount: msg.value
     });

    players[msg.sender].betsId.push(bets.length);
    players[msg.sender].betAmount += msg.value;
    bets.push(b);
    matches[_matchId].betAmount += msg.value;
    totalBetAmount += msg.value;

    NewBet(b.betId, b.timestamp, b.matchId, b.playerAddress, b.outcome, b.amount);
  }

  function getTotalBetAmount() view public returns (uint) {
    return totalBetAmount;
  }

  function getPlayer(address _user) view public returns (uint, uint[]) {
    return (players[_user].betAmount, players[_user].betsId);
  }

  function getTokensForMatch(bytes32 _matchId) view public returns (uint) {
    return matches[_matchId].betAmount;
  }

  function getMatches() view public returns (bytes32[]) {
    return matchesList;
  }

  function getBetsCount() view public returns (uint) {
    return bets.length;
  }

  function getBetAt(uint _i) view public returns (bytes32, address, uint, uint) {
    return (bets[_i].matchId, bets[_i].playerAddress, bets[_i].outcome, bets[_i].amount);
  }

  function transferTo(address _account) public {
    require(msg.sender == owner);
    _account.transfer(this.balance);
  }

}
