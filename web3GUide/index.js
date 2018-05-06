var Web3 = require('web3');

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

web3.eth.defaultAccount = web3.eth.accounts[1];

var contractAddress = "0xb710cf7c48ae6dec0730502a860cda649257f8a6"
var contractAbi = [
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
        "name": "amountOfAcc",
        "type": "uint256"
      },
      {
        "name": "standardPrice",
        "type": "uint256"
      },
      {
        "name": "renterCount",
        "type": "uint256"
      },
      {
        "name": "color",
        "type": "string"
      },
      {
        "name": "city",
        "type": "string"
      },
      {
        "name": "electric",
        "type": "bool"
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "bikes",
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
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ownerToBike",
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "city",
        "type": "string"
      }
    ],
    "name": "NewBike",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "contractID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "bikeID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "request",
        "type": "bool"
      }
    ],
    "name": "NewEmptyContract",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getBikeCount",
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
    "constant": false,
    "inputs": [
      {
        "name": "city",
        "type": "string"
      },
      {
        "name": "amountOfAcc",
        "type": "uint256"
      },
      {
        "name": "electric",
        "type": "bool"
      },
      {
        "name": "standardPrice",
        "type": "uint256"
      },
      {
        "name": "color",
        "type": "string"
      }
    ],
    "name": "createBike",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getMyBikeIDs",
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
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
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getMyBikeByID",
    "outputs": [
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "bool"
      },
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
    "inputs": [
      {
        "name": "bikeID",
        "type": "uint256"
      },
      {
        "name": "rentStart",
        "type": "uint256"
      },
      {
        "name": "rentEnd",
        "type": "uint256"
      },
      {
        "name": "placeStart",
        "type": "string"
      },
      {
        "name": "placeEnd",
        "type": "string"
      },
      {
        "name": "radius",
        "type": "uint256"
      },
      {
        "name": "price",
        "type": "uint256"
      },
      {
        "name": "onRequest",
        "type": "bool"
      }
    ],
    "name": "createEmptyContract",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "checkForContract",
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
    "constant": true,
    "inputs": [
      {
        "name": "bikeID",
        "type": "uint256"
      },
      {
        "name": "contractID",
        "type": "uint256"
      }
    ],
    "name": "getBikeContractInfo",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

var bikeContract = web3.eth.contract(contractAbi);

var bikeInstance = bikeContract.at(contractAddress);

/////////////////////////////////////////////////////////////CREATING////////////////////////////////////////////////////////////////////////////////////////////

bikeInstance.createBike("Wetteren", 7, false, 1, "rood", { from: web3.eth.defaultAccount, gas:3000000 });
  //string city, uint amountOfAcc, bool electric, uint standardPrice, string color


/////////////////////////////////////////////////////////////MY BIKES////////////////////////////////////////////////////////////////////////////////////////////


var a = bikeInstance.getMyBikeIDs({ from: web3.eth.defaultAccount });

console.log("ALL MY BIKES");
for(var i = 0; i < a.length; i++){
  var params = bikeInstance.getMyBikeByID(i);
  console.log(i + 1 + ":");
  console.log("Stad: " + params[0]);
  console.log("Kleur: " + params[1]);
  console.log("aantal versnellingen: " + params[2]);
  console.log("aantal huurders: " + params[3]);
  console.log("standaard prijs: " + params[4]);
  console.log("elektrisch: " + params[5]);
}


/////////////////////////////////////////////////////////////ALL BIKES////////////////////////////////////////////////////////////////////////////////////////////


var a = bikeInstance.getBikeCount();

console.log("ALL BIKES");
for(var i = 0; i < a; i++){
  console.log(i + 1 + ":");
  var params = bikeInstance.getMyBikeByID(i);
  console.log("Stad: " + params[0]);
  console.log("Kleur: " + params[1]);
  console.log("aantal versnellingen: " + params[2]);
  console.log("aantal huurders: " + params[3]);
  console.log("standaard prijs: " + params[4]);
  console.log("elektrisch: " + params[5]);
  console.log("owner: " + params[6]);
}


/////////////////////////////////////////////////////////////CREATE EMPTY CONTRACTS////////////////////////////////////////////////////////////////////////////////////////////


bikeInstance.createEmptyContract(0, 123456789, 234567890, "51684546515%48455685515", "515135151531%268546489564", 1000, 2, 0, { from: web3.eth.defaultAccount, gas:3000000 });
bikeInstance.createEmptyContract(1, 123456789, 234567890, "51684546515%48455685515", "515135151531%268546489564", 1000, 2, 0, { from: web3.eth.defaultAccount, gas:3000000 });


/////////////////////////////////////////////////////////////GET ALL AVAILABLE BIKECONTRACTS////////////////////////////////////////////////////////////////////////////////////////////

var a = bikeInstance.getBikeCount();

console.log("ALL AVAILABLE BIKES");
for(var i = 0; i < a; i++){
  var continueVar = bikeInstance.checkForContract(i);
  if(continueVar != 0){
    for(var j = 0; j < continueVar; j++){
      var params = bikeInstance.getBikeContractInfo(i, j);
      if(params[0] != 0){
        console.log("fiets " + i + ":");
        console.log("contract " + j + ":");
        console.log("start tijd: " + params[0]);
        console.log("eind tijd: " + params[1]);
        console.log("prijs: " + params[2]);
        console.log("op aanvraag: " + params[3]);
      }
    }
  }
}