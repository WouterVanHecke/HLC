pragma solidity ^0.4.0;

contract Bikes {

    event NewBike(uint id, address owner, string city);
    event NewEmptyContract(uint contractID, address owner, uint bikeID, bool request);

    struct Renting {

        address renter;

        uint rentStart;
        uint rentEnd;
        string placeStart;
        string placeEnd;
        uint radius;
        uint price;
        bool onRequest;
    
    }

    struct Bike {
        
        address owner;
        
        uint amountOfAcc;
        uint standardPrice;
        uint renterCount;
        
        string color;
        string city;

        bool electric;
'
        mapping(uint => Renting) renters;
        
    }

    Bikes[] public bikes;

    mapping (uint => Bike) public idToBike;
    mapping (address => uint[]) public ownerToBike;

    uint public bikeCount;

    //GETTER TO GET ALL BIKES

    function getBikeCount() view public returns(uint) {
        return bikeCount;
    }

    //CREATE A NEW BIKE

    function createBike(string city, uint amountOfAcc, bool electric, uint standardPrice, string color) public {
        Bike memory b;
        b.owner = msg.sender;
        b.amountOfAcc = amountOfAcc;
        b.standardPrice = standardPrice;
        b.renterCount = 0;
        b.color = color;
        b.city = city;
        b.electric = electric;

        //bikes.push(b);
        idToBike[bikeCount] = b;
        ownerToBike[msg.sender].push(bikeCount);
        
        emit NewBike(bikeCount, msg.sender, city);
        bikeCount++;
    }

    //GETTERS FOR BIKE

    function getMyBikeIDs() external view returns(uint[]){
        return ownerToBike[msg.sender];
    }

    function getMyBikeByID(uint id) external view returns(string, string, uint, uint, uint, bool, address){
        return (idToBike[id].city, idToBike[id].color, idToBike[id].amountOfAcc, 
        idToBike[id].renterCount, idToBike[id].standardPrice, idToBike[id].electric, idToBike[id].owner);
    }

    //SET AVAILABLE (CREATE EMPTY CONTRACT)
    function createEmptyContract(
        uint bikeID, uint rentStart, uint rentEnd, string placeStart, string placeEnd, uint radius, uint price, bool onRequest) public {

        Renting memory r;
        r.rentStart = rentStart;
        r.rentEnd = rentEnd;
        r.placeStart = placeStart;
        r.placeEnd = placeEnd;
        r.radius = radius;
        r.price = price;
        r.onRequest = onRequest;

        idToBike[bikeID].renters[idToBike[bikeID].renterCount++] = r;
        emit NewEmptyContract(idToBike[bikeID].renterCount - 1, msg.sender, bikeID, onRequest);
    }

    //GETTERS FOR CONTRACT

    function checkForContract(uint id) external view returns(uint) {
        return idToBike[id].renterCount;
    }

    function getBikeContractInfo(uint bikeID, uint contractID) external view returns(uint, uint, uint, bool) {
        //if(owner==address(0))
        if(idToBike[bikeID].renters[contractID].renter == address(0)){
            return (idToBike[bikeID].renters[contractID].rentStart, idToBike[bikeID].renters[contractID].rentEnd,
            idToBike[bikeID].renters[contractID].price, idToBike[bikeID].renters[contractID].onRequest);
        }else{
            return (0,0,0,false);
        }
    }

}
