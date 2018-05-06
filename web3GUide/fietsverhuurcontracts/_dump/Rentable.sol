pragma solidity ^0.4.18;

contract Rentable {

  address public owner;
  address public renter;
  
  uint rentableStart;
  uint rentableEnd;

  uint rentedBegin;
  uint rentedEnd;

  uint ratePerFifteenMinutes;

  function Rentable() public {
    owner = msg.sender;
  }

  function makeAvailable(uint _rentableStart, uint _rentableEnd, uint _ratePerFifteenMinutes) public onlyOwner {
    require(_rentableStart >= now); //has to take place in the future (note that this does not yet take into account inaccuracy of blocktimes)
    require(_rentableEnd >= _rentableStart + 15 minutes); // MINIMUM available for 15 minutes
    require((_rentableEnd - _rentableStart) % 15 minutes == 0); // always in intervals of 15 minutes
    require(_ratePerFifteenMinutes > 0); // pricerate must be non-zero
    
    rentableStart = _rentableStart;
    rentableEnd = _rentableEnd;
    ratePerFifteenMinutes = _ratePerFifteenMinutes;
  }

  function beingRented() internal view returns (bool) {
    // if the asset has not been rented atleast ONCE, these values will be zero.
    if (rentedBegin != 0 && rentedEnd != 0) {
      if (now >= rentedBegin && now <= rentedEnd) {
        return(true);
      }
    }   
    return(false);
   }

  // an asset is available when the owner made it available and when it is not already being rented
  function isAvailable() view public returns(bool) {
    if (now >= rentableStart && now <= rentableEnd) {
      return(!beingRented());
    }
    return(false);
  }
  
  function calculateRentPrice(uint _startTime, uint _endTime) view public returns (uint) {
    return(((_endTime - _startTime)/(60*15)) * ratePerFifteenMinutes);
  }


  modifier onlyWhenAvailable() {
    require(isAvailable());
    _;
  }
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
  
  modifier onlyRenter() {
    require(msg.sender == renter);
    _;
  }
  
}