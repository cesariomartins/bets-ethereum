// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
  	local: {
      host: "localhost", 
      port: 8545,
      network_id: "*",
      gas: 4700000
    },
    dev: {
      host: '54.232.215.98',
      port: 8545,
      network_id: '*',
      from: '0xab68d38b7941136a633cc74f05f8554ea3565f75',
   	  gas: 4700000
    }
  }
}
