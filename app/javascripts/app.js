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
  contractInstance.placeBet(gameId, betTokens, outcome, {gas: 4700000, from: web3.eth.accounts[0]}).then(function() {
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


window.buyTokens = function() {
 let tokensToBuy = $("#buy").val();
 let price = tokensToBuy * tokenPrice;
 $("#buy-msg").html("Purchase order has been submitted. Please wait.");
 Betting.deployed().then(function(contractInstance) {
  contractInstance.buy({value: web3.toWei(price, 'ether'), from: web3.eth.accounts[0]}).then(function(v) {
   $("#buy-msg").html("");
   web3.eth.getBalance(contractInstance.address, function(error, result) {
    $("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
   });
  })
 });
 populateTokenData();
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
    //populateBetsData();
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
    $("#" + matches[name]).html(v.toString());
   });
  });
 }
}

function populateBetsData() {
 
 $("#bets-rows").empty();
 var numBets = 2;
 for (var i = 0; i < numBets; i++) {
  Betting.deployed().then(function(contractInstance) {
    var j = parseInt(i);
   contractInstance.getBetAt.call(j).then(function(v) {
    $("#bets-rows").append("<tr><td>" + v[0].toString() + "</td>");
   });
  });
 }
}


function populateTokenData() {
 Betting.deployed().then(function(contractInstance) {
  contractInstance.getIssuedTokens().then(function(v) {
   $("#tokens-sold").html(v.toString());
  });
  contractInstance.getUsedTokens.call().then(function(v) {
   $("#tokens-used").html(v.toString());
  });
  contractInstance.getTokenPrice().then(function(v) {
   tokenPrice = parseFloat(web3.fromWei(v.toString()));
   $("#token-cost").html(tokenPrice + " Ether");
  });
  web3.eth.getBalance(contractInstance.address, function(error, result) {
   $("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
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