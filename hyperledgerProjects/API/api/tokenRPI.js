const fs = require('fs')
const jwt = require('jsonwebtoken')
const ethCrypto = require('eth-crypto')

var cert = fs.readFileSync('./api/jwtRS256.key')

const Eth = require('ethjs')
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'))
eth.defaultAccount = eth.accounts[0]
var bikesAddr = '0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f'

var bikesAbi = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "_bikeIdx",
				"type": "uint256"
			}
		],
		"name": "getBikeRenter",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_rate",
				"type": "uint256"
			},
			{
				"name": "_startTime",
				"type": "uint256"
			},
			{
				"name": "_endTime",
				"type": "uint256"
			}
		],
		"name": "calculateRentPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_bikeIdx",
				"type": "uint256"
			},
			{
				"name": "_rentableStart",
				"type": "uint256"
			},
			{
				"name": "_rentableEnd",
				"type": "uint256"
			},
			{
				"name": "_ratePerFifteenMinutes",
				"type": "uint256"
			}
		],
		"name": "makeBikeAvailable",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "idToBike",
		"outputs": [
			{
				"name": "owner",
				"type": "address"
			},
			{
				"name": "renter",
				"type": "address"
			},
			{
				"name": "rentableStart",
				"type": "uint256"
			},
			{
				"name": "rentableEnd",
				"type": "uint256"
			},
			{
				"name": "rentedBegin",
				"type": "uint256"
			},
			{
				"name": "rentedEnd",
				"type": "uint256"
			},
			{
				"name": "ratePerFifteenMinutes",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_bikeIdx",
				"type": "uint256"
			}
		],
		"name": "getBikeOwner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "createBike",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_bikeIdx",
				"type": "uint256"
			},
			{
				"name": "_startTime",
				"type": "uint256"
			},
			{
				"name": "_endTime",
				"type": "uint256"
			}
		],
		"name": "requestRent",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_bikeIdx",
				"type": "uint256"
			}
		],
		"name": "bikeIsAvailable",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "bikeCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_owner",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "BikeCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_bikeIdx",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_startTime",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_endTime",
				"type": "uint256"
			}
		],
		"name": "BikeRented",
		"type": "event"
	}
]

var bikesInstance = eth.contract(bikesAbi).at(bikesAddr)

var inputBike = 0
var bikeAvailable = false
var renter = 0

// promises voor bike availability, renter en owner
// res => res is sugar voor res { return res} (identity function)
var availablePromise = bikesInstance.bikeIsAvailable(inputBike).then(res => res)
var renterPromise = bikesInstance.getBikeRenter(inputBike).then(res => res)
var ownerPromise = bikesInstance.getBikeOwner(inputBike).then(res => res)
var rentedEndPromise = bikesInstance.getBikeRentedEndPromise(inputBike).then(res => res)

var signedTokenPromise = Promise.all([availablePromise,renterPromise,ownerPromise,rentedEndPromise]).then(function(values) {
    // the values variable is structured like:
    // Result { '0': false }
    // Result { '0': "0x00"}
    // ...

    available = values[0]['0']
    renter = values[1]['0']
	owner = values [2]['0']
	rentedEnd = values[3]['0']
    var token = new Object()
    token.fietsId = inputBike
    token.owner = owner
    token.renter = '0xf17f52151ebef6c7334fad080c5704d77216b732'
	token.available = available
	token.rentedEnd = rentedEnd
    return jwt.sign(token, cert, { algorithm: 'RS256', expiresIn: 60 })
})


// Deel dat op de RPI komt te staan hieronder:

//raspberry pi heeft de volgende gegevens in zijn geheugen:
var certPub = fs.readFileSync('./api/jwtRS256.key.pub') // pub key van de API(s)
var fietsIdRpi = 0 // id van de fiets waartoe hij behoort
var ownerRpi = '0x627306090abab3a6e1400e9345bc60c78a8bef57'// address van de eignaar van de fiets

// token laten decrypteren door RPI met Pub key user (RPI weet nu zeker dat de token afkomstig is van de user met pub adress x) (pub key meegegeve door user)
// token laten decrypteren door RPI met pub key API (pub key zit in geheugen v. RPI)
// info controleren:
	// RPI controleert of fiets == fietsID in token (gaat het om deze fiets?)
	// RPI controleert of fiets NIET available is (indien hij wel available is kan hij gehuurd worden! (zie logica contract))
	// RPI controleert de renter in de token (address) overeenkomt met degene die de token naar hem stuurt	
var renterAccPublicKey = eth.accounts[1]
var renterAccPrivateKey = "0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f" 

var renterSignedHashPromise = signedTokenPromise.then(res => {
	var msgHash = ethCrypto.hash.keccak256(res)
	var renterSignedHash = ethCrypto.sign(renterAccPrivateKey, msgHash)
	return renterSignedHash
})


var RPIPromise = Promise.all([renterSignedHashPromise,signedTokenPromise]).then(function (values){
	var signedHashFromRenter = values[0]
	var token = values[1]

	// get public key from user sending the token
	var tokenHashedInRpi = ethCrypto.hash.keccak256(token)
	var senderAddr = ethCrypto.recover(signedHashFromRenter,tokenHashedInRpi)

	//decrypt token made by API with api's public key
	jwt.verify(token,certPub, function (err, decoded){
		// should normally not occur, unless public-private keypair do not match
		if(err){
			return false;
		} else{
			//check information in token
			return(available == true || decoded.renter != senderAddr || fietsId != fietsIdRpi || decoded.owner != ownerRpi)
		}
	})
})


//renterSignedTokenPromise is send

