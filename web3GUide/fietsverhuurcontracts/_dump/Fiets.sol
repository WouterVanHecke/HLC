pragma solidity ^0.4.18;

import "./Rentable.sol";

contract FietsTokenInterface {
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool);
}


contract Fiets is Rentable {

    FietsTokenInterface fti;

    function Fiets(address _fti) {
        fti = FietsTokenInterface(_fti);
    }

    function kill() public onlyOwner {
        selfdestruct(owner);
    } 

    function requestRent(uint _startTime, uint _endTime) onlyWhenAvailable {
        require(_startTime >= now); // has to take place in the future
        require(_endTime >= _startTime + 900); // rent minimum 15 minutes
        require((_endTime - _startTime) % 900 == 0); // always in intervals of 15 minutes
        // The user must have already sent a transaction to the approve method of FietsToken, in order for the next transaction to be approved
        fti.transferFrom(msg.sender, owner, calculateRentPrice(_startTime, _endTime));
        renter = msg.sender;
        rentedBegin = _startTime;
        rentedEnd = _endTime;
  }

}
