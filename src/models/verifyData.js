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
    // Error 
    while (unqExist) { unqID = generator(20); unqExist = await checkunqIDExists(unqID) }
    while (verExist) { verifyGenToken = generator(20); unqExist = await checkunqIDExists(verifyGenToken) }
    ERRCODESTR = ""; r=""
    outs = await isUserIdExists(userID)
    if (outs) {
        crack = await optUpdate(userID, verifyGenToken, hash)
        ERRCODESTR = "OTP_UPDATED"
        r="OTP re-send successfully"
    } else {
        crack = await otpInsert(unqID, userID, verifyGenToken, hash)
        ERRCODESTR = "OTP_SEND"
        r="OTP send successfully"
    }
    mailer(email, otp)
    return [true, ERRCODESTR, r, [crack, verifyGenToken]]
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
        return [false, "INVALID_OTP", "Unverified OTP", null]
    } else {
        if (data == userID) {
            res = await updateVerification(userID)
            if (res == 1) {
                return [true, "OTP_VERIFIED", "OTP Verification Successful", null]
            } else {
                return [false, "OTP_PASS_VERIFICATION_ERROR", "OTP Verified, error in verification update", null]
            }
        } else {
            // return "USERID_UNVERIFIED"
            return [false, "USERID_UNVERIFIED", "User Id not validated", null]
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