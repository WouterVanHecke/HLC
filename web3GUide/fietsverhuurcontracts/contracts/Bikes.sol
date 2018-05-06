pragma solidity ^0.4.18;

import "./BikeToken.sol";

contract Bikes is BikeToken {

    struct Renting {

        address renter;
        uint rentedStart;
        uint rentedEnd;
    
    }

    struct Bike {
        
        address owner;

        uint rentableStart;
        uint rentableEnd;
        uint ratePerFifteenMinutes;
        
        uint renterCount;
        mapping(uint => Renting) renters;
    
    }

  //Signed degrees format (DDD.dddddd)
  //Latitudes range from -90 to 90.
  //Longitudes range from -180 to 180.
  //we have 6 figs after the comma so x 10^6 (https://en.wikipedia.org/wiki/Decimal_degrees#Precision)
  //we cant use floats in solidity yet, hence the notation
  // Long and lat + radius determine where the bike originally is and the size of acceptable drop offs
  int8 originalLatitudeBC;
  uint24 originalLatitudeAC;
  int8 originalLongitudeBC;
  uint24 originalLongitudeAC;
  // radius in millimeter
  uint bikeRadius;

  // These long/lat will determine where the bike CURRENTLY is, initially the same as original, but will change when bike is rented
  int8 currentLatitudeBC;
  uint24 currentLatitudeAC;
  int16 currentLongitudeBC;
  uint24 currentLongitudeAC;


  //We need to use some average values because we cant use floating points nor complex calculcations (cosine) in solidity.
  //Below are constants declared for Belgium:
  // ------------------------------------------
  //average latitude distance for one degree in millimeters for belgium 
  uint constant latDistAvg = 111238000;
  //average difference in longitude distance in millimeters in thousands of a degree from [49.5,51.5] (ie diff in LONG dist for two lats: 50.001 & 50.002)
  uint constant longDiffAvg = 1500;
  //LONGITUDE distance in millimeters for 51.5 degrees (top of belgium)
  uint constant longDistTop = 69440000;
  //degree * 10^3 for lat top.
  uint constant latTop= 51500;
  // ------------------------------------------



  mapping (uint => Bike) public idToBike;
  uint public bikeCount;

  function getBikeCount() view public returns(uint) {
    return bikeCount;
  }
  
  // seperate getters for each field in the Bike struct, because web3 cannot handle these types yet:
  function getBikeOwner(uint _bikeIdx) view public returns(address) {
    return idToBike[_bikeIdx].owner;
  }

  function getBikeRentableStart(uint _bikeIdx) view public returns (uint) {
    return idToBike[_bikeIdx].rentableStart;
  }

   function getBikeRentableEnd(uint _bikeIdx) view public returns (uint) {
    return idToBike[_bikeIdx].rentableEnd;
  }

  function getBikeRate(uint _bikeIdx) view public returns (uint) {
    return idToBike[_bikeIdx].ratePerFifteenMinutes;
  }

  function getBikeRenterCount(uint _bikeIdx) view public returns (uint) {
    return idToBike[_bikeIdx].renterCount;
  }

  // Likewise, getters for the renter in the renting struct of the bike:

  function getBikeRenterAddress(uint _bikeIdx, uint _renterIdx) view public returns (address) {
    return idToBike[_bikeIdx].renters[_renterIdx].renter;
  }

  function getBikeRentedStart(uint _bikeIdx, uint _renterIdx) view public returns (uint) {
    return idToBike[_bikeIdx].renters[_renterIdx].rentedStart;
  }

  function getBikeRentedEnd(uint _bikeIdx, uint _renterIdx) view public returns (uint) {
    return idToBike[_bikeIdx].renters[_renterIdx].rentedEnd;
  }

  event BikeCreated(address _owner, uint _id);

  function createBike() public {
    Bike memory b;
    b.owner = msg.sender;
    idToBike[bikeCount] = b;
    bikeCount++;
    BikeCreated(msg.sender,bikeCount-1);
  }


  function makeBikeAvailable(uint _bikeIdx, uint _rentableStart, uint _rentableEnd, uint _ratePerFifteenMinutes) {
    require(_rentableStart >= now); //has to take place in the future (note that this does not yet take into account inaccuracy of blocktimes)
    require(_rentableEnd >= _rentableStart + 15 minutes); // MINIMUM available for 15 minutes
    require((_rentableEnd - _rentableStart) % 15 minutes == 0); // always in intervals of 15 minutes
    require(_ratePerFifteenMinutes > 0); // pricerate must be non-zero

    Bike storage b = idToBike[_bikeIdx];
    require(b.owner == msg.sender);
    //TODO: you cannot make the bike available again if it is being rented at this very moment
    //...
    b.rentableStart = _rentableStart;
    b.rentableEnd = _rentableEnd;
    b.ratePerFifteenMinutes = _ratePerFifteenMinutes;
    b.renterCount = 0;
  }


  // an asset is available when the owner made it available and when it is not already being rented
  function bikeIsAvailable(uint _bikeIdx, uint _startTime, uint _endTime) view public returns(bool) {
    Bike storage _bike = idToBike[_bikeIdx];
    // if the bike is NOT exclusively in the rentable interval, return false
    if (!(_startTime >= _bike.rentableStart && _endTime <= _bike.rentableEnd)) {return (false);}
    if (_bike.renterCount == 0) {return(true);}
    // check if time is between any rented intervals in the Renters array of the bike
    for (uint i = 0; i < _bike.renterCount; i++) {
      // if the bike overlaps with a rented interval, return false
      if(!(_endTime <= _bike.renters[i].rentedStart || _startTime >= _bike.renters[i].rentedEnd)){
        return(false);
      }
    }
    return(true);
  }
  
  function calculateRentPrice(uint _rate, uint _startTime, uint _endTime) public pure returns (uint) {
    return(((_endTime - _startTime)/(60*15)) * _rate);
  }

  event BikeRented(uint _bikeIdx, address _to, uint _startTime, uint _endTime);
  
  function requestRent(uint _bikeIdx, uint _startTime, uint _endTime) public {
    Bike storage _bike = idToBike[_bikeIdx];
    require(_startTime >= now); // has to take place in the future
    require(_endTime >= _startTime + 900); // rent minimum 15 minutes
    require((_endTime - _startTime) % 900 == 0); // always in intervals of 15 minutes
    require(bikeIsAvailable(_bikeIdx, _startTime, _endTime)); // bike must be available
    
    transfer(_bike.owner, calculateRentPrice(_bike.ratePerFifteenMinutes, _startTime, _endTime));
    // Make a rentEntry object and push it into the renting array
    Renting storage _rentEntry;
    _rentEntry.renter = msg.sender;
    _rentEntry.rentedStart = _startTime;
    _rentEntry.rentedEnd = _endTime;
    _bike.renters[_bike.renterCount++] = _rentEntry;

    BikeRented(_bikeIdx, msg.sender, _startTime, _endTime);
  } 


  function abs(int a) returns (uint) {
    if(a < 0){
      return uint(a * -1);
    }
    return uint(a);
  }

  function sqrt(uint x) returns (uint) {
    uint z = (x + 1) / 2;
    y = x;
    while (z < y) {
      y = z;
      z = (x / z + z) / 2;
    }
    return y;
  }


  //not safe against replay attacks, need to add nonce (too time consuming for this PoC, tho)
  function checkInput(bytes32 dataHash, bytes32 r, bytes32 s,uint latBC, uint latAC, uint longBC, uint longAC) returns(address) {
    bytes32 inputHash = sha3(latBC,latAC,longBC,longAC);
    address RPI = ecrecover(dataHash,v,r,s);
  }


  //Input is latitude without commas, so:
  // 51.5 -> 51500
  function getLongDistFromLat(uint lat) returns(uint) {
    uint amount = latTop - lat;
    uint diff = longDiffAvg * amount;
    return longDistTop + diff;
  }

  //lat and long should be formatted like:
  // lat: 51.5 deg -> 51500
  // long: 4.002 deg -> 4002
  // returns a distance in mm
  function getDistanceBetween(Bike b, uint lat1,uint long1) returns (uint){
    uint difflng = abs(int(bikeLongCenter - long1));
    uint difflat = abs(int(bikeLatCenter - lat1));
    uint dlat = (difflat * latDistAvg) /1000;
    uint longDist = getLongDistFromLat(lat1);
    uint dlong = (difflng * longDist) / 1000;
    uint res = sqrt(dlong * dlong + dlat * dlat);
    return res;
    }

  // problem: renter can just input arbitrary long/lat data. how to know for sure that long/lat of bike is correct?
  //function dropOffBike(uint _bikeIdx, uint _renterIdx) {
    //Bike bike = idToBike[_bikeIdx];
    //Renting renting = idToBike[_bikeIdx].renters[_renterIdx];
    //can only drop off bike when time is between intervals & you are renting it:
    //require(renting.renter == msg.sender);

  //}


  // maybe make it so msg has to havebeen signed by RPI? (else user could just input some random longs/lats)
  // renter gets deposit back when:
    // the deposit is his
    // bike is dropped off in the good radius=
    // bike is dropped off on time
  //function finalizeRent(uint _bikeIdx, uint _renterIdx) {
    //Renting renting = idToBike[_bikeIdx].renters[_renterIdx];
    //require(renting.renter == msg.sender); // only the renter can finalize his own rent
    //require(now <= renting.rentedEnd); // only when current time is under or equal to rentedend


  //}
}