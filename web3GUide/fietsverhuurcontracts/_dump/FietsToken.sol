pragma solidity ^0.4.18;

import "./SafeMath.sol";

contract FietsToken {

  using SafeMath for uint256;
  mapping(address => uint256) balances;
  mapping (address => mapping (address => uint256)) internal allowed;

  uint256 totalSupply;
  address owner;

  function FietsToken() {
      owner = msg.sender;
  }

  modifier onlyOwner() {
      require(msg.sender == owner);
      _;
  }

  event Approve(address sender, address spender);

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
    return true;
  }

  function transfer(address _to, uint256 _value) public returns(bool) {
    require(_to != address(0));
    require(_value <= balances[msg.sender]);

    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    return(true);
  }

  function approve(address _spender, uint256 _value) public returns (bool) {
    allowed[msg.sender][_spender] = _value;
    Approve(msg.sender,_spender);
    return true;
  }

  function allowance(address _owner, address _spender) public view returns (uint256) {
    return allowed[_owner][_spender];
  }

  function isApprovedToSpendAmountForOwner(address _owner, address _spender, uint amount) public view returns (bool) {
    return allowed[_owner][_spender] == amount;
  }

  function mint(address _to, uint256 _amount) onlyOwner public {
    totalSupply = totalSupply.add(_amount);
    balances[_to] = balances[_to].add(_amount);
  }

  function balanceOf(address _owner) public view returns (uint256 balance) {
    return balances[_owner];
  }

}