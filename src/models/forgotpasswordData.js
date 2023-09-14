require("dotenv").config()
const md5 = require('md5')
const generator = require("../extra/generators")
const printer = require("../extra/colorPrinter")
const connection = require("../db/connection")
const mailer = require("../extra/mailer")
const userTable = process.env.USERSTABLE;
const fpTable = process.env.FPTABLE;

async function fpgenerateCracks(username, mail, token) {

    if (username != null && mail != null){
        dataUnqID = await fpUnM(username, mail)
    } else if (username != null && token != null){
        dataUnqID = await fpUnT(username, token)
    } else if (mail != null && token != null){
        dataUnqID = await fpMnT(mail, token)
    }

    if (dataUnqID == false){
        return [false, "NO_DATA_FOUND", "No Data Found", null]
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
    a = false
    ERRCODESTR = ""; r=""
    outs = await isUserIdExists(userUnqID)
    if (outs) {
        crack = await optUpdate(userUnqID, fpGenToken, hash)
        if(crack == 1){
            const mails = await mailer.sendMailOTP(mail, otp)
            mails = false;
            if (mails){
                a = true;
                ERRCODESTR = "OTP_UPDATED_AND_SEND"
                r="OTP re-send successfully"
            } else {
                ERRCODESTR = "OTP_UPDATED_SEND_ERROR"
                r="OTP updated successfully but send error"
            }
        } else {
            ERRCODESTR = "OTP_RESEND_FAIL"
            r="OTP re-send Fail"
        }
    } else {
        crack = await otpInsert(unqID, userUnqID, fpGenToken, hash)
        if (crack == 1){
            const mails = await mailer.sendFPMailOTP(mail, otp)
            console.log(mails)
            mails = false;
            if (mails){
                a = true
                ERRCODESTR = "OTP_INSERTED_AND_SEND"
                r="OTP inserted and send successfully"
            } else {
                ERRCODESTR = "OTP_INSERTED_MAIL_SEND_ERROR"
                r="OTP inserted successfully but send error"
            }
        } else {
            ERRCODESTR = "OTP_SEND_FAIL"
            r="OTP send Fail"
        }
    }
    return [a, ERRCODESTR, r, [fpGenToken]]
}

function genOTP() {
    const out = generator(8)
    const outhash = md5(out)
    return [out, outhash]
}

async function fpUnM(username, mail){
    QUERY = `SELECT osa_userUnqID FROM ${userTable} 
    where osa_userName = '${username}' AND osa_userMail = '${mail}'`;
    const [dataSet] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (dataSet.length == 0) { return false } else { return dataSet }
}

async function fpUnT(username, token){
    QUERY = `SELECT osa_userUnqID FROM ${userTable} 
    where osa_userName = '${username}' AND osa_newToken = '${token}'`;
    const [dataSet] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (dataSet.length == 0) { return false } else { return dataSet }
}

async function fpMnT(mail, token){
    QUERY = `SELECT osa_userUnqID FROM ${userTable} 
    where osa_userMail = '${mail}' AND osa_newToken = '${token}'`;
    const [dataSet] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (dataSet.length == 0) { return false } else { return dataSet }
}

async function isUserIdExists(userID) {
    QUERY = `SELECT userID FROM ${fpTable} where userID = '${userID}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

async function optUpdate(userID, fpToken, hash) {
    QUERY = `UPDATE ${fpTable} SET 
    fpToken='${fpToken}',otpHash='${hash}',time=CURRENT_TIMESTAMP 
    WHERE userID='${userID}'`
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    return await yy['affectedRows']
}

async function otpInsert(unqid, userID, fpToken, hash) {
    QUERY = `INSERT INTO ${fpTable} (unqID, userID, fpToken, fpVerified, fpPassToken, otpHash, time)
    VALUES ('${unqid}', '${userID}', '${fpToken}', '0', '0', '${hash}', CURRENT_TIMESTAMP)`
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    return await yy['affectedRows']
}

async function checkunqIDExists(id) {
    QUERY = `SELECT userID FROM ${fpTable} where unqID = '${id}'`;
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

async function checkTokenExists(token) {
    QUERY = `SELECT userID FROM ${fpTable} where fpToken = '${token}'`;
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

async function fpotpCracks(verifyToken, otpHash) {
    var data = await checkOTP(verifyToken, otpHash) // 0 or userid
    
    fpPassGenToken = generator(40)
    var fptPassExist = await checkfpPassTokenExists(fpPassGenToken)
    while (fptPassExist) { fpPassGenToken = generator(20); fptPassExist = await checkfpPassTokenExists(fpPassGenToken) }

    if (!data){
        return [false, "NO_DATA_FOUND", "No Data Found", null]
    } else {
        var data2 = await updateVerification(data, fpPassGenToken)
        if (data2 == 1){
            return [true, "OTP_VERIFIED_NEW_FPPASS_GENERATED", "OTP Verified and fppass token for password update generated", [fpPassGenToken]]
        } else {
            return [false, "OTP_VERIFIED_FPPASS_ERROR", "OTP Verified but error in fppass token error", null]
        }
    }
}

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
    const [yy] = await connection.query(QUERY)
    .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

async function fpUpdatePasswordCracks(fpPassToken, passwordHash) {
    const yy = await checkFPPass(fpPassToken)
    if(yy[0]['fpVerified']==0){
        return [false, "NO_FPPASS_TOKEN_FOUND", "No Data Found", null]
    } else {
        const yyy = await updatePassword(data[0]['userid'], passwordHash)
        if(yyy==1){
            return [true, "FPPASS_VERIFIED_PASSWORD_UPDATED", "No Data Found", null]
        }else {
            return [false, "FPPASS_VERIFIED_PASSWORD_UPDATE_ERROR", "No Data Found", null]
        }
    }
}

async function checkFPPass(fpPassToken){
    QUERY = `SELECT userid, fpVerified FROM ${fpTable} WHERE fpPassToken='${fpPassToken}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return yy }
}

async function updatePassword(userID, passwordHash){
    QUERY = `UPDATE ${userTable} 
    SET osa_passWord='${passwordHash}'
    WHERE osa_userUnqID='${userID}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    return await yy['affectedRows']
}

module.exports = {fpgenerateCracks, fpotpCracks, fpUpdatePasswordCracks}