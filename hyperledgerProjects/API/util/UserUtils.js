var CryptoJS = require("crypto-js")
var EthCrypto = require('eth-crypto')

class UserUtils {

    static hashPasswordAndPrivatekey(password) {
        //An ethereum keypair is generated together with an address:
        var ident = EthCrypto.createIdentity()
        var publickey = ident.publicKey
        var privatekey = ident.privateKey
        var address = ident.address
        //two random 128-bit salts are generated
        CryptoJS.lib.WordArray.random()
        var saltpassword = CryptoJS.lib.WordArray.random(128, 8).toString()
        var saltprivatekey = CryptoJS.lib.WordArray.random(128, 8).toString()
        //the password is salted and then hashed with SHA-3 (output: 512 bits)
        var passwordandsalt = password.concat(saltpassword)
        var hashpassword = CryptoJS.SHA3(passwordandsalt).toString(CryptoJS.enc.Hex)

        //PBKDF2 is used to generate an AES-256 key from the password and the second salt
        var key256Bits = CryptoJS.PBKDF2(password, saltprivatekey, {
            keySize: 256 / 32,
            iterations: 1000
        }).toString()

        //This key is used to encrypt the private key
        var encryptedprivatekey = (CryptoJS.AES.encrypt(privatekey, key256Bits)).toString()


        return {
            "saltpassword": saltpassword,
            "saltprivatekey": saltprivatekey,
            "hashedpassword": hashpassword,
            "encryptedprivatekey": encryptedprivatekey
        }

    }

    static verifyLogin(password, salt, hashedpassworddb) {
        var passwordandsalt = password.concat(salt)
        var hashedpassword = CryptoJS.SHA3(passwordandsalt).toString()
        console.log(hashedpassword)
        return hashedpassword == hashedpassworddb
    }

    static hex2a(hex) {
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
    static decryptPrivatekey(password, salt, encryptedprivatekey) {
        var key256Bits = CryptoJS.PBKDF2(password, salt, {
            keySize: 256 / 32,
            iterations: 1000
        }).toString()
        var privatekey = CryptoJS.AES.decrypt(encryptedprivatekey, key256Bits)
        return this.hex2a(privatekey.toString())
    }
}

module.exports = UserUtils