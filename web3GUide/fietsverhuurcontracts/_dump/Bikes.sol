pragma solidity ^0.4.18;

import "./BikeToken.sol";

contract Bikes is BikeToken {

  function Bikes() {

  }

  struct Bike {
    
  address owner;
  address renter;
  
  uint rentableStart;
  uint rentableEnd;

  uint rentedBegin;
  uint rentedEnd;

  uint ratePerFifteenMinutes;

  }

  mapping (uint => Bike) public idToBike;
  uint public bikeCount;

  event BikeCreated(address _owner, uint _id);

  function createBike() public {
    Bike storage b;
    b.owner = msg.sender;
    idToBike[bikeCount] = b;
    bikeCount++;
    BikeCreated(msg.sender,bikeCount-1);
  }

  function getBikeOwner(uint _bikeIdx) view public returns(address) {
    return idToBike[_bikeIdx].owner;
  }

  function getBikeRenter(uint _bikeIdx) view public returns (address) {
    return idToBike[_bikeIdx].renter;
  }
  function getBikeRentedEnd(uint _bikeIdx) view public returns (uint) {
    return idToBike[_bikeIdx].rentedEnd;
  }

  function getBikeRate(uint _bikeIdx) view public returns (uint) {
    return idToBike[_bikeIdx].ratePerFifteenMinutes
  }

  function makeBikeAvailable(uint _bikeIdx, uint _rentableStart, uint _rentableEnd, uint _ratePerFifteenMinutes) {
    require(_rentableStart >= now); //has to take place in the future (note that this does not yet take into account inaccuracy of blocktimes)
    require(_rentableEnd >= _rentableStart + 15 minutes); // MINIMUM available for 15 minutes
    require((_rentableEnd - _rentableStart) % 15 minutes == 0); // always in intervals of 15 minutes
    require(_ratePerFifteenMinutes > 0); // pricerate must be non-zero
    Bike storage b = idToBike[_bikeIdx]; // throws if bike not found at this index.
    require(b.owner == msg.sender);
    b.rentableStart = _rentableStart;
    b.rentableEnd = _rentableEnd;
    b.ratePerFifteenMinutes = _ratePerFifteenMinutes;
  }

  // an asset is available when the owner made it available and when it is not already being rented
  function bikeIsAvailable(uint _bikeIdx) view public returns(bool) {
    Bike memory _bike = idToBike[_bikeIdx];
    // check if time is between availability specified by owner
    if (now >= _bike.rentableStart && now <= _bike.rentableEnd) {
      //check if bike has been rented before
      if (_bike.rentedBegin != 0 && _bike.rentedEnd != 0) {
        // check if time is between the rented interval specified by the renter
        if (now >= _bike.rentedBegin && now <= _bike.rentedEnd) {
          return(false);
        }
      }
      return(true);   
    }
    return(false);
  }
  
  function calculateRentPrice(uint _rate, uint _startTime, uint _endTime) public pure returns (uint) {
    return(((_endTime - _startTime)/(60*15)) * _rate);
  }

  event BikeRented(uint _bikeIdx, address _to, uint _startTime, uint _endTime);
  
  function requestRent(uint _bikeIdx, uint _startTime, uint _endTime) public {
    Bike storage _bike = idToBike[_bikeIdx];
    // The user must have already sent a transaction to the approve method of FietsToken, in order for the next transaction to be approved
    require(bikeIsAvailable(_bikeIdx)); // bike must be available
    require(_startTime >= now); // has to take place in the future
    require(_endTime >= _startTime + 900); // rent minimum 15 minutes
    require((_endTime - _startTime) % 900 == 0); // always in intervals of 15 minutes
    transfer(_bike.owner, calculateRentPrice(_bike.ratePerFifteenMinutes, _startTime, _endTime));
    _bike.renter = msg.sender;
    _bike.rentedBegin = _startTime;
    _bike.rentedEnd = _endTime;
    BikeRented(_bikeIdx, msg.sender, _startTime, _endTime);
  }
}