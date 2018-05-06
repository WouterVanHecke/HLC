function deg2rad(deg) {

    var convfactor = (2.0 * Math.PI) / 360.0;

    return (deg * convfactor);

}



function compute(deglat) {

    // Convert latitude to radians

    var lat = deg2rad(deglat)



    // Set up "Constants"

    var m1 = 111132.92 // latitude calculation term 1

    var m2 = -559.82 // latitude calculation term 2

    var m3 = 1.175 // latitude calculation term 3

    var m4 = -0.0023 // latitude calculation term 4

    var p1 = 111412.84 // longitude calculation term 1

    var p2 = -93.5 // longitude calculation term 2

    var p3 = 0.118 // longitude calculation term 3



    // Calculate the length of a degree of latitude and longitude in meters

    var latlen = m1 + (m2 * Math.cos(2 * lat)) + (m3 * Math.cos(4 * lat)) + (m4 * Math.cos(6 * lat))

    var longlen = (p1 * Math.cos(lat)) + (p2 * Math.cos(3 * lat)) + (p3 * Math.cos(5 * lat))

    return longlen

}

var sum  = 0
for (var j = 500; j <= 999; j++) {
    var latInM = compute(49 + (j / 1000))
    var next = compute(49 + ((j + 1) / 1000))
    var latInM2 = compute(51 + (j / 1000))
    var next2 = compute(51 + ((j + 1) / 1000))
    var diff1 = latInM - next
    var diff2 = latInM2 - next2
    sum += diff1
    sum += diff2
}

for (var j = 0; j <= 999; j++) {
    var latInM = compute(50 + (j / 1000))
    var next = compute(50 + ((j + 1) / 1000))
    var diff1 = latInM - next
    sum += diff1
}

console.log(sum/2000)