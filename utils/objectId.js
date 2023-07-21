import CryptoJs from "crypto-js"

export function encryptObjectId(id) {
    return CryptoJs.AES.encrypt(id, process.env.CRYPTO_SECRET).toString().replace(/\//g, process.env.OBJECTID_SLACE_REPLACE)
}

export function decryptObjectId(id) {
    return CryptoJs.AES.decrypt(id.replace(new RegExp(process.env.OBJECTID_SLACE_REPLACE, 'g'), '/'), process.env.CRYPTO_SECRET).toString(CryptoJs.enc.Utf8)
}