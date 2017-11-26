var betting_artifacts = require('./build/contracts/Betting.json')
var contract = require('truffle-contract')
var Web3 = require('Web3')
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var Betting = contract(betting_artifacts);
Betting.setProvider(provider);

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(provider);
}

// Express server which the frontend with interact with
var express = require('express');
var app = express();
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');

// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('15NUJ8jbrA4PjDINRvc4QaMDuaCrOG2mZiKQBT-C47rM');

app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});

app.listen(3000, function() {
 console.log('Ethereum server listening on port 3000!');
});

function setupBetEventListner() {
	let betEvent;
 	Betting.deployed().then(function(i) {
		betEvent = i.NewBet({fromBlock: 0, toBlock: 'latest'});
		betEvent.watch(function(err, result) {
 			if (err) {
    			console.log(err)
    			return;
   			}
   			console.log(result.args);
   			doc.useServiceAccountAuth(creds, function (err) {
   				doc.getRows(1, {}, function(err, rows ) {
  					if(err) {
    					console.log(err);
  					}
  					if (rows.length == 0 || parseInt(result.args._betId) > parseInt(rows[rows.length-1].betid))
  						saveNewBetData(result.args._betId, result.args._timestamp, web3.toUtf8(result.args._matchId), result.args._playerAddress, result.args._outcome, result.args._amount);
				});
			});   	
  		});
 	})
}

function saveNewBetData(_betId, _timestamp, _matchId, _playerAddress, _outcome, _amount) {
	// Authenticate with the Google Spreadsheets API.
	doc.useServiceAccountAuth(creds, function (err) {
		doc.addRow(1, { 
			betId: _betId,
			timestamp: _timestamp,
			matchId: _matchId, 
			playerAddress: _playerAddress,
			outcome: _outcome,
			amount: _amount
		}, function(err) {
			if(err) {console.log(err);
			}
		});
	});
}

setupBetEventListner();

// respond with "JSON of bets" when a GET request is made to the /bets
app.get('/bets', function (req, res) {
	
	// Authenticate with the Google Spreadsheets API.
	doc.useServiceAccountAuth(creds, function (err) {
  		// Get all of the rows from the spreadsheet.
  		doc.getRows(1, function (err, rows) {
  			var bets = new Array();
  			for (var i = 0, len = rows.length; i < len; i++) {
  				var b = {
	  				betId : rows[i].betid,
	  				timestamp : rows[i].timestamp,
	  				matchId : rows[i].matchid,
	  				playerAddress : rows[i].playeraddress,
	  				outcome : rows[i].outcome,
					amount : rows[i].amount
				}
				bets.push(b); 
			}
    		res.json(bets);
  		});
	});
});