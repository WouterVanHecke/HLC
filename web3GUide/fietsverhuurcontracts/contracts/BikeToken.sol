pragma solidity ^0.4.18;

import "./SafeMath.sol";

contract BikeToken {

  using SafeMath for uint256;
  mapping(address => uint256) balances;
  uint256 totalSupply;
  address owner;

  struct Deposit {
    
    address owner;
    address renter;

    uint256 value;

    bool locked;

    //if lock is closed:
      //no action, wait until time is over
    //if lock is opened:
      //if bike is in proper range:
        // funds go back to renter
      //else:
        // funds are given to owner
      // deposit 
  }

  function BikeToken() {
      owner = msg.sender;
  }

  modifier onlyOwner() {
      require(msg.sender == owner);
      _;
  }

  function transfer(address _to, uint256 _value) public returns(bool) {
    require(_to != address(0));
    require(_value <= balances[msg.sender]);

    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    return(true);
  }

  function mint(address _to, uint256 _amount) onlyOwner public {
    totalSupply = totalSupply.add(_amount);
    balances[_to] = balances[_to].add(_amount);
  }

  function burn(address _from, uint256 _amount) onlyOwner public {
    require(balances[_from].sub(_amount) >= 0);
    balances[_from] = balances[_from].sub(_amount);
    totalSupply = totalSupply.sub(_amount);
  }
  function balanceOf(address _owner) public view returns (uint256 balance) {
    return balances[_owner];
  }

}