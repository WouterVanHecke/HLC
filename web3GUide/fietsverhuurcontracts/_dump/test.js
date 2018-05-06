function arePointsNear(checkPoint, centerPoint, km) {
    var ky = 111.2380000;

    var ky6 = ky * 100000
    var degreeslatcenter = (Math.PI * centerPoint.lat / 180.0);
    var pi6 = 3141592
    var lat6 = 100000 * centerPoint.lat
    var deg6 = 180 * 100000
    var degreeslatcenter6 = (pi6 * lat6) / deg6

    // console.log("normal:")
    // console.log(ky)
    // console.log("3.141592")
    // console.log(centerPoint.lat)
    // console.log("180")
    // console.log(degreeslatcenter)

    // console.log("multiplied by 10^6: ")
    // console.log(ky6)
    // console.log(pi6)
    // console.log(lat6)
    // console.log(deg6)
    // console.log(degreeslatcenter6)

    var kx = Math.cos(degreeslatcenter) * ky;
    var lngdiff = Math.abs(centerPoint.lng - checkPoint.lng);
    var latdiff = Math.abs(centerPoint.lat - checkPoint.lat);
    console.log('long diff: ' + lngdiff)
    console.log('lat diff: ' + latdiff)
    console.log('km lats: ' + ky)
    console.log('km longs: ' + kx)

    console.log('----------------------------')
    var dx = lngdiff * kx;
    var dy = latdiff * ky;
    console.log('distance longs: ' + dx)
    console.log('distance lats: ' + dy)
    console.log('-------------------------')
    console.log(ky)
    console.log(kx)
    console.log(dx)
    console.log(dy)
    var res = Math.sqrt(dx * dx + dy * dy)
    console.log('--------')
    console.log(res)
    return res <= km;
}

var aalst = { lat: 50.936, lng: 4.040952 };
var aalst2 = { lat: 50.939, lng: 4.036735};
var bxl = {lat: 50.850346, lng: 4.351721}

var n = arePointsNear(aalst, aalst2, 1);
console.log(n)