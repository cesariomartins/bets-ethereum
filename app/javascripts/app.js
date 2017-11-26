// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import betting_artifacts from '../../build/contracts/Betting.json'

let Betting = contract(betting_artifacts);

let matches = {}

let tokenPrice = null;

window.placeBet = function(candidate) {
 let gameId = $("#gameId").val();
 let betTokens = $("#bet-tokens").val();
 let outcome = $("#outcome").val();
 $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
 $("#gameId").val("");
 $("#bet-tokens").val("");
 $("#outcome").val("");

 Betting.deployed().then(function(contractInstance) {
  contractInstance.placeBet(gameId, outcome, {value: web3.toWei(betTokens, 'ether'), gas: 4700000, from: web3.eth.accounts[0]}).then(function() {
   let div_id = matches[gameId];
   return contractInstance.getTokensForMatch.call(gameId).then(function(v) {
    $("#" + div_id).html(v.toString());
    $("#msg").html("");
    populateTokenData();
   });
  });
 });
 populateBetsData();
}


window.lookupPlayer = function() {
 let address = $("#player-address").val();
 Betting.deployed().then(function(contractInstance) {
  contractInstance.getPlayer.call(address).then(function(v) {
   $("#tokens-bought").html("Total Tokens bought: " + v[0].toString());
   let bets = v[1];
   $("#votes-cast").empty();
   $("#votes-cast").append("BetIds: ");
   $("#votes-cast").append(bets);
   //let allCandidates = Object.keys(candidates);
   //for(let i=0; i < allCandidates.length; i++) {
    //$("#votes-cast").append(allCandidates[i] + ": " + votesPerCandidate[i] + "");
   //}
  });
 });
}

function populateMatches() {
 
 Betting.deployed().then(function(contractInstance) {
    return contractInstance.getMatches.call();
  }).then(function(matchesArray) {
    for(let i=0; i < matchesArray.length; i++) {
    /* We store the game names as bytes32 on the blockchain. We use the
     * handy toUtf8 method to convert from bytes32 to string
     */
      matches[web3.toUtf8(matchesArray[i])] = "game-" + i;
    }
    setupMatchRows();
    populateMatchTokens();
    populateBetsData();
    populateTokenData();
  }).catch(function(e) {
    console.log(e);
  // There was an error! Handle it.
  });
}


function setupMatchRows() {
  Object.keys(matches).forEach(function (g) { 
    $("#matches-rows").append("<tr><td>" + g + "</td><td id='" + matches[g] + "'></td></tr>");
  });
}

function populateMatchTokens() {
 let gameNames = Object.keys(matches);
 for (var i = 0; i < gameNames.length; i++) {
  let name = gameNames[i];
  Betting.deployed().then(function(contractInstance) {
   contractInstance.getTokensForMatch.call(name).then(function(v) {
    $("#" + matches[name]).html(web3.fromWei(v.toString(), 'ether'));
   });
  });
 }
}

function populateBetsData() {
  $("#bets-rows").empty();
  $.getJSON('http://localhost:3000/bets', function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#bets-rows").append("<tr>");
      $("#bets-rows").append("<td>" + data[i].betId + "</td>");
      $("#bets-rows").append("<td>" + data[i].playerAddress + "</td>");
      $("#bets-rows").append("<td>" + data[i].matchId + "</td>");
      $("#bets-rows").append("<td>" + data[i].outcome + "</td>");
      $("#bets-rows").append("<td>" + web3.fromWei(data[i].amount, 'ether') + "</td>");          
      $("#bets-rows").append("</tr>");
    }
  });
}


function populateTokenData() {
 Betting.deployed().then(function(contractInstance) {
  contractInstance.getTotalBetAmount().then(function(v) {
   $("#tokens-sold").html(web3.fromWei(v.toString(), 'ether'));
  });
 });
}

$( document ).ready(function() {
 if (typeof web3 !== 'undefined') {
  console.warn("Using web3 detected from external source like Metamask")
  // Use Mist/MetaMask's provider
  window.web3 = new Web3(web3.currentProvider);
 } else {
  console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
 }

 Betting.setProvider(web3.currentProvider);
 populateMatches();

});