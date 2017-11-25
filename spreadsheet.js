var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');
 
// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('15NUJ8jbrA4PjDINRvc4QaMDuaCrOG2mZiKQBT-C47rM');
 
// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {
 
  // Get all of the rows from the spreadsheet.
  doc.getRows(1, function (err, rows) {
    console.log(rows.length);
  });


doc.addRow(1, { 
	_gameId: 'Agnew', 
	_playerAddress: 'Samuel',
	_outcome: 'k',
	_tokens: 'e'
	}, function(err) {if(err) {console.log(err);}
});


});