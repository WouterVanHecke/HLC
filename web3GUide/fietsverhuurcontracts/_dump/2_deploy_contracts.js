//var ConvertLib = artifacts.require("./ConvertLib.sol");
//var MetaCoin = artifacts.require("./MetaCoin.sol");

var Rentable = artifacts.require("./Rentable.sol");
var Fiets = artifacts.require("./Fiets.sol");
var FietsToken = artifacts.require("./FietsToken.sol");
var SafeMath = artifacts.require("./SafeMath.sol");

module.exports = function(deployer) {
  //deployer.deploy(ConvertLib);
  //deployer.link(ConvertLib, MetaCoin);
  //deployer.deploy(MetaCoin);

  deployer.deploy(SafeMath);
  deployer.link(SafeMath,FietsToken);
  deployer.deploy(FietsToken).then(function (){
    return deployer.deploy(Rentable).then(function() {
      return deployer.deploy(Fiets,FietsToken.address)
    })
  });

};
