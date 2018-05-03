// when a user logs in, we want to make sure his password matches (trivial)
// we also want to hold a session which gives him his private key from the server

var password = "123456"
var salt1 = "bla"
var salt2 = "bloe"

//1. verify SHA-3(input + Db.users.(username).salt1) == Db.users.(username).hashedpw

//2. get the AES-256 key needed to decrypt the encrypted private key for user 

var key256Bits = CryptoJS.PBKDF2(password, salt2, { keySize: 256/32, iterations: 1000 })

//3. decrypt the private key from the DB with the generated AES 256 key

var privatekey = CryptoJS.AES.decrypt("encryptedpk", key256Bits)

//4. store this decrypted private key in a session variable?
// let it expire after 30 mins?
// destroy after log out