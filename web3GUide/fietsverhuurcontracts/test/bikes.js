import expectThrow from '../util/expectThrow'

var bikes = artifacts.require('./Bikes.sol')
var biketoken = artifacts.require('./BikeToken.sol')
const moment = require('moment')

function removeDigits (x, n) {
  return (x - (x % Math.pow(10, n))) / Math.pow(10, n)
}


contract('Bikes', async (accounts) => {

  it('Should set up', async () => {
    let instance = await bikes.deployed()
    // 2 fietsen voor account 0
    await instance.createBike() // id 0
    await instance.createBike() // id 1
    // 1 fiets voor account 1
    await instance.createBike({ from: accounts[1] }) // id 2
  })
  it('should be available when the time interval is in the available timeslot', async () => {
    var now = moment.now()
    var from = removeDigits(now.valueOf(), 3) // exact nu
    var to = removeDigits(moment(now).add(2, 'hours').valueOf(), 3) // 2 uur NA nu.
    let instance = await bikes.deployed()
    await instance.makeBikeAvailable(0, from, to, 1, { from:accounts[0] })

    var beginTime = removeDigits(moment(now).add(30, 'minutes').valueOf(), 3)
    var endTime = removeDigits(moment(now).add(90, 'minutes').valueOf(), 3)
    let available = await instance.bikeIsAvailable.call(0, beginTime, endTime)

    assert.equal(available, true, 'Bike is not available')
  })

  it('should not be available when the time interval is not in the available timeslot', async () => {
    var now = moment.now()
    var from = removeDigits(moment(now).add(2, 'hours').valueOf(), 3) // 2 uur NA nu
    var to = removeDigits(moment(now).add(4, 'hours').valueOf(), 3) // 4 uur NA nu.

    let instance = await bikes.deployed()
    await instance.makeBikeAvailable(0, from, to, 1, { from:accounts[0] })
    var beginTime = removeDigits(moment(now).add(30, 'minutes').valueOf(), 3)
    var endTime = removeDigits(moment(now).add(90, 'minutes').valueOf(), 3)
    let available = await instance.bikeIsAvailable.call(0, beginTime, endTime)
    assert.equal(available, false, 'Bike is available')
  })

  it('should not let someone make a bike available if that bike is not his', async () => {
    var now = moment.now()
    var beginTime = removeDigits(moment(now).add(2, 'hours').valueOf(), 3) // 2 uur NA nu
    var endTime = removeDigits(moment(now).add(4, 'hours').valueOf(), 3) // 4 uur NA nu.

    let instance = await bikes.deployed()
    await expectThrow(instance.makeBikeAvailable(0, beginTime, endTime, 1, { from:accounts[1]}))
  })

  it('Should transfer the correct amount of funds from renter to owner when the renter rents the bike.', async () => {
    var now = moment.now()
    var beginTime = removeDigits(now.valueOf(), 3) // exact nu
    var endTime = removeDigits(moment(now).add(2, 'hours').valueOf(), 3) // 2 uur NA nu.
    
    // Gehuurd voor 30 minuten
    var rentBeginTime = beginTime
    var rentEndTime = removeDigits(moment(now).add(30, 'minutes').valueOf(), 3)
    var pricePerFifteenMinutes = 1
    let bikesinstance = await bikes.deployed()
    await bikesinstance.mint(accounts[1], 100)
    await bikesinstance.makeBikeAvailable(0, beginTime, endTime, pricePerFifteenMinutes, { from:accounts[0] })
    var ownerBalance = await bikesinstance.balanceOf.call(accounts[0]).then(function (result) {
      return result.toNumber() // Promise resolven met then, aangezien het een BigNumber teruggeeft .toNumber() oproepen.
    })
    await bikesinstance.requestRent(0, rentBeginTime, rentEndTime, { from:accounts[1], gas:3700000 })

    var afterRentBalanceOwner = await bikesinstance.balanceOf.call(accounts[0]).then(function (result) {
      return result.toNumber() // Promise resolven met then, aangezien het een BigNumber teruggeeft .toNumber() oproepen.
    })
    assert.equal(afterRentBalanceOwner, ownerBalance + 2, 'Balance of owner should be incremented by the correct amount')
  })

  it('bla', async () => {
    let bikesinstance = await bikes.deployed()
    console.log(await bikesinstance.getBikeRenterAddress.call(0,0))
    console.log(await bikesinstance.getBikeRentedStart.call(0,0))
    console.log(await bikesinstance.getBikeRentedEnd.call(0,0))

  })
})
