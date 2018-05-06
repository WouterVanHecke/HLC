var fiets = artifacts.require('./Fiets.sol')
var fietsToken = artifacts.require('./FietsToken.sol')
const moment = require('moment')

function removeDigits (x, n) {
  return (x - (x % Math.pow(10, n))) / Math.pow(10, n)
}

contract('Fiets', async (accounts) => {
  it('Should be available when the current time is in the available timeslot', async () => {
    var now = moment.now()
    var beginTime = removeDigits(now.valueOf(), 3) // exact nu
    var endTime = removeDigits(moment(now).add(2, 'hours').valueOf(), 3) // 2 uur NA nu.

    let instance = await fiets.deployed()
    await instance.makeAvailable(beginTime, endTime, 1, { from:accounts[0] })
    let available = await instance.isAvailable.call()

    assert.equal(available, true, 'Bike is not available')
  })

  it('Should not be available when current time is not in the available timeslot', async () => {
    var now = moment.now()
    var beginTime = removeDigits(moment(now).add(2, 'hours').valueOf(), 3) // 2 uur NA nu
    var endTime = removeDigits(moment(now).add(4, 'hours').valueOf(), 3) // 4 uur NA nu.

    let instance = await fiets.deployed()
    await instance.makeAvailable(beginTime, endTime, 1, { from:accounts[0] })
    let available = await instance.isAvailable.call()

    assert.equal(available, false, 'Bike is available')
  })

  it('Should not be available when the owner did not make it available', async () => {
    let instance = await fiets.deployed()
    let available = await instance.isAvailable.call()

    assert.equal(available, false, 'Bike is available')
  })

  it('Should transfer the correct amount of funds from renter to owner when the renter rents the bike.', async () => {
    var now = moment.now()
    var beginTime = removeDigits(now.valueOf(), 3) // exact nu
    var endTime = removeDigits(moment(now).add(2, 'hours').valueOf(), 3) // 2 uur NA nu.
    
    // Gehuurd voor 30 minuten
    var rentBeginTime = beginTime
    var rentEndTime = removeDigits(moment(now).add(30, 'minutes').valueOf(), 3)
    var pricePerFifteenMinutes = 1

    let finstance = await fiets.deployed()
    let ftinstance = await fietsToken.deployed()
    await ftinstance.mint(accounts[1], 100) 
    await finstance.makeAvailable(beginTime, endTime, pricePerFifteenMinutes, { from:accounts[0] })

    await ftinstance.approve(finstance.address, 2, { from:accounts[1] })
    var ownerBalance = await ftinstance.balanceOf.call(accounts[0]).then(function (result) {
      return result.toNumber() // Promise resolven met then, aangezien het een BigNumber teruggeeft .toNumber() oproepen.
    })
    await finstance.requestRent(rentBeginTime, rentEndTime, { from:accounts[1], gas:2700000 })

    var afterRentBalanceOwner = await ftinstance.balanceOf.call(accounts[0]).then(function (result) {
      return result.toNumber() // Promise resolven met then, aangezien het een BigNumber teruggeeft .toNumber() oproepen.
    })
    assert.equal(afterRentBalanceOwner, ownerBalance + 2, 'Balance of owner should be incremented by the correct amount')
  })

})
