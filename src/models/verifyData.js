const md5 = require('md5')
const generator = require("../extra/generators")
const printer = require("../extra/colorPrinter")
const connection = require("../db/connection")

function out(d) { console.log(d) }

// Main OTP Generation Function

async function verifygenerateCracks(userID, email) {
    verifyGenToken = generator(40)
    unqID = generator(20)
    
    x = genOTP()
    otp = x[0], hash = x[1]
    
    var unqExist = await checkunqIDExists(unqID)
    var verExist = await checkTokenExists(verifyGenToken)
    
    while (unqExist) { unqID = generator(20); var unqExist = await checkunqIDExists(unqID) }
    while (verExist) { verifyGenToken = generator(20); var unqExist = await checkunqIDExists(verifyGenToken) }
    
    outs = await isUserIdExists(userID)
    if (outs) {
        crack = await optUpdate(userID, verifyGenToken, hash)
    } else {
        crack = await otpInsert(unqID, userID, verifyGenToken, hash)
    }
    mailer(email, otp)
    return ["SUCCESSFUL", crack, verifyGenToken]
}

// Helper OTP Generation Function

async function isUserIdExists(userID) {
    QUERY = `SELECT userID FROM verifytable where userID = '${userID}'`;
    // QUERY = `SELECT userID FROM verifytable where 1`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}


async function optUpdate(userID, verifierToken, hash) {
    QUERY = `UPDATE verifytable SET 
    verifierToken='${verifierToken}',otpHash='${hash}',time=CURRENT_TIMESTAMP 
    WHERE userID='${userID}'`
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))

    return await yy['affectedRows']
}

async function otpInsert(unqid, userID, verifierToken, hash) {
    QUERY = `INSERT INTO verifytable (unqID, userID, verifierToken, otpHash, time) 
    VALUES ('${unqid}', '${userID}', '${verifierToken}', '${hash}', CURRENT_TIMESTAMP)`
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    return await yy['affectedRows']
}

async function checkunqIDExists(id) {
    QUERY = `SELECT userID FROM verifytable where unqID = '${id}'`;
    // QUERY = `SELECT userID FROM verifytable where 1`;
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

async function checkTokenExists(token) {
    QUERY = `SELECT userID FROM verifytable where verifierToken = '${token}'`;
    // QUERY = `SELECT userID FROM verifytable where 1`;
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

// setInterval(()=>{
//     (async ()=>{
//         var result = await verifygenerateCracks(generator(1))
//         console.log(result)
//     })()
// }, 1000)

// Main OTP Verification Function

async function verifyotpCracks(userID, verifyToken, otpHash) {
    var data = await checkOTP(verifyToken, otpHash) // 0 or userid

    if (data == 0){
        return "INVALID_OTP"
    } else {
        if (data == userID) {
            res = await updateVerification(userID)
            if (res == 1) {
                return "VERIFIED"
            } else {
                return "OTP_PASS_VERIFICATION_ERROR"
            }
        } else {
            return "USERID_UNVERIFIED"
        }
    }
}

// Helper OTP Verification Function

async function checkOTP(data0, data1) {
    QUERY = `SELECT userID FROM verifytable WHERE verifierToken='${data0}' AND otpHash='${data1}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0){
        return 0
    } else {
        return yy[0].userID
    }
}

async function updateVerification(userID) {
    QUERY = `UPDATE users 
    SET isVerified='1'
    WHERE username='${userID}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    return await yy['affectedRows']
}

// setTimeout(() => {
//     (async () => {
//         // var result = await checkOTP("ccc", "ddd")
//         var result = await verifyotpCracks("bbb", "ccc", "ddd")
//         console.log(result)
//     })()
// }, 0)

// Global Helper Function

function mailer(to, otp) { console.log(`Gmail: ${to}. Your OTP is ${otp}`); }
function insert(data) { console.log(`Inserting ${data}`) }

function genOTP() {
    const out = generator(8)
    const outhash = md5(out)
    return [out, outhash]
}

module.exports = {verifygenerateCracks, verifyotpCracks}