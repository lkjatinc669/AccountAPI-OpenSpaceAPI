require("dotenv").config()
const md5 = require('md5')
const generator = require("../extra/generators")
const printer = require("../extra/colorPrinter")
const connection = require("../db/connection")
const userTable = process.env.USERSTABLE;
const fpTable = process.env.FPTABLE;

function out(d) { console.log(d) }

// Main OTP Generation Function

async function fpgenerateCracks(username, mail, token) {

    if (username != null && mail != null){
        dataUnqID = await fpUnM(username, mail)
    } else if (username != null && token != null){
        dataUnqID = await fpUnT(username, token)
    } else if (mail != null && token != null){
        dataUnqID = await fpMnT(mail, token)
    }

    if (dataUnqID == false){
        return "Error"
    } else {
        userUnqID = dataUnqID[0]['osa_userUnqID']
    }

    x = genOTP()
    otp = x[0], hash = x[1]

    fpGenToken = generator(40)
    unqID = generator(20)
    
    var unqExist = await checkunqIDExists(unqID)
    var fptExist = await checkTokenExists(fpGenToken)

    while (unqExist) { unqID = generator(20); unqExist = await checkunqIDExists(unqID) }
    while (fptExist) { fpGenToken = generator(20); fptExist = await checkTokenExists(fpGenToken) }

    ERRCODESTR = ""; r=""
    outs = await isUserIdExists(userUnqID)
    if (outs) {
        crack = await optUpdate(userUnqID, fpGenToken, hash)
        ERRCODESTR = "OTP_UPDATED"
        r="OTP re-send successfully"
    } else {
        crack = await otpInsert(unqID, userUnqID, fpGenToken, hash)
        ERRCODESTR = "OTP_SEND"
        r="OTP send successfully"
    }
    mailer(mail, otp)
    return [true, ERRCODESTR, r, [crack, fpGenToken]]
}

// Helper OTP Generation Function

async function fpUnM(username, mail){
    QUERY = `SELECT osa_userUnqID FROM ${userTable} 
    where osa_userName = '${username}' AND osa_userMail = '${mail}'`;
    // QUERY = `SELECT userID FROM verifytable where 1`;
    const [dataSet] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (dataSet.length == 0) { return false } else { return dataSet }
}

async function fpUnT(username, token){
    QUERY = `SELECT osa_userUnqID FROM ${userTable} 
    where osa_userName = '${username}' AND osa_newToken = '${token}'`;
    // QUERY = `SELECT userID FROM verifytable where 1`;
    const [dataSet] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (dataSet.length == 0) { return false } else { return dataSet }
}

async function fpMnT(mail, token){
    QUERY = `SELECT osa_userUnqID FROM ${userTable} 
    where osa_userMail = '${mail}' AND osa_newToken = '${token}'`;
    // QUERY = `SELECT userID FROM verifytable where 1`;
    const [dataSet] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (dataSet.length == 0) { return false } else { return dataSet }
}

// Checker of UserID

async function isUserIdExists(userID) {
    QUERY = `SELECT userID FROM ${fpTable} where userID = '${userID}'`;
    // QUERY = `SELECT userID FROM verifytable where 1`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

// Insert ot update Operations

async function optUpdate(userID, fpToken, hash) {
    QUERY = `UPDATE ${fpTable} SET 
    fpToken='${fpToken}',otpHash='${hash}',time=CURRENT_TIMESTAMP 
    WHERE userID='${userID}'`
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))

    return await yy['affectedRows']
}

async function otpInsert(unqid, userID, fpToken, hash) {
    QUERY = `INSERT INTO openspaceforgotpasswordtable (unqID, userID, fpToken, fpVerified, fpPassToken, otpHash, time)
    VALUES ('${unqid}', '${userID}', '${fpToken}', '0', NULL, CURRENT_TIMESTAMP)`
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    return await yy['affectedRows']
}

// Checker Help function

async function checkunqIDExists(id) {
    QUERY = `SELECT userID FROM ${fpTable} where unqID = '${id}'`;
    // QUERY = `SELECT userID FROM verifytable where 1`;
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

async function checkTokenExists(token) {
    QUERY = `SELECT userID FROM ${fpTable} where fpToken = '${token}'`;
    // QUERY = `SELECT userID FROM verifytable where 1`;
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

// setInterval(()=>{
//     (async ()=>{
//         u="googleoop"; m="googleoop@gmail.com"; t="XKC3ax21pscfGxP1KepXdUAI3VAdqA"
//         var result = await fpgenerateCracks(u, m)
//         console.log(result)
//     })()
// }, 60000)

    // (async ()=>{
    //     u="googleoop"; m="googleoop@gmail.com"; t="XKC3ax21pscfGxP1KepXdUAI3VAdqA"
    //     var result = await fpgenerateCracks(u, m)
    //     console.log(result)
    //     process.exit()
    // })()

// Main OTP Verification Function



















































async function fpotpCracks(verifyToken, otpHash) {
    var data = await checkOTP(verifyToken, otpHash) // 0 or userid
    
    fpPassGenToken = generator(40)
    var fptPassExist = await checkfpPassTokenExists(fpPassGenToken)
    while (fptPassExist) { fpPassGenToken = generator(20); fptPassExist = await checkfpPassTokenExists(fpPassGenToken) }

    if (data == 0){
        console.log("ERR")
    } else {
        var data2 = await updateVerification(data, fpPassGenToken)
        if (data2 == 1){
            console.log(fpPassGenToken)
        } else {
            console.log("Error Occured")
        }
    }

    // if (data == 0){
    //     return [false, "INVALID_OTP", "Unverified OTP", null]
    // } else {
    //     if (data == userID) {
    //         res = await updateVerification(userID)
    //         if (res == 1) {
    //             return [true, "OTP_VERIFIED", "OTP Verification Successful", null]
    //         } else {
    //             return [false, "OTP_PASS_VERIFICATION_ERROR", "OTP Verified, error in verification update", null]
    //         }
    //     } else {
    //         // return "USERID_UNVERIFIED"
    //         return [false, "USERID_UNVERIFIED", "User Id not validated", null]
    //     }
    // }
}

// Helper OTP Verification Function

async function checkOTP(token, hash) {
    QUERY = `SELECT unqid FROM ${fpTable} WHERE fpToken='${token}' AND otpHash='${hash}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0){
        return false
    } else {
        return yy[0]['unqid']
    }
}

    // (async () => {
    //     // var result = await checkOTP("ccc", "ddd")
    //     var result = await fpotpCracks("O82UYMsmQK9V1eUymL5Btncc5L2FVNnrPnJjvsTF", "a3bf736c9ac71bbfcc2b2e393a380867")
    //     console.log(result)
    //     process.exit()
    // })()


async function updateVerification(unqid, token) {
    QUERY = `UPDATE ${fpTable} 
    SET fpVerified='1', fpPassToken='${token}'
    WHERE unqid='${unqid}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    return await yy['affectedRows']
}

async function checkfpPassTokenExists(token) {
    QUERY = `SELECT userID FROM ${fpTable} where fpPassToken = '${token}'`;
    // QUERY = `SELECT userID FROM verifytable where 1`;
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

// setTimeout(() => {
//     (async () => {
//         // var result = await checkOTP("ccc", "ddd")
//         var result = await verifyotpCracks("bbb", "ccc", "ddd")
//         console.log(result)
//     })()
// }, 0)



async function fpUpdatePasswordCracks(fpPassToken, passwordHash) {
    const data = await checkFPPass(fpPassToken)
    if(data[0]['fpVerified']==0){

    } else {
        const data2 = await updatePassword(data[0]['unqid'], passwordHash)
        console.log(data2)
    }
}

async function checkFPPass(fpPassToken){
    QUERY = `SELECT unqid, fpVerified FROM ${fpTable} WHERE fpPassToken='${fpPassToken}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
        console.log(yy)
    if (yy.length == 0) { return false } else { return yy }
}
    (async () => {
        // var result = await checkOTP("ccc", "ddd")
        fpPass = "pMM1BhDopckq1OziKgvKBKO4YXdHfBaSYNFEYeV9" 
        var result = await fpUpdatePasswordCracks(fpPass, "fdhfsdhkjlasfhkjsafhkjlshadjkhakfjhlhksfjdhksdghkahdfjkshakjfhsalf")
        console.log(result)
        process.exit()
    })()


async function updatePassword(userID, passwordHash){
    QUERY = `UPDATE ${userTable} 
    SET osa_passWord='${passwordHash}'
    WHERE osa_userUnqID='${userID}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    return await yy['affectedRows']
}





// Global Helper Function

function mailer(to, otp) { console.log(`Gmail: ${to}. Your OTP is ${otp}`); }
function insert(data) { console.log(`Inserting ${data}`) }

function genOTP() {
    const out = generator(8)
    const outhash = md5(out)
    return [out, outhash]
}

module.exports = {fpgenerateCracks, fpotpCracks}