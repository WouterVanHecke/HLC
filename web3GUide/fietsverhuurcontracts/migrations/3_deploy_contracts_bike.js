
var Bikes = artifacts.require("./Bikes.sol")
var BikeToken = artifacts.require("./BikeToken.sol")
var SafeMath = artifacts.require("./SafeMath.sol")

module.exports = function(deployer) {
    deployer.deploy(SafeMath)
    deployer.link(SafeMath,BikeToken)
    deployer.deploy(BikeToken).then(function () {
        return deployer.deploy(Bikes)
    })
}