var Bikes = artifacts.require("./Bikes.sol");

module.exports = function(deployer) {
    deployer.deploy(Bikes)
}