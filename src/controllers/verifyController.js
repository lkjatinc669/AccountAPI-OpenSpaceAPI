const verifyData = require("../models/verifyData")
const verifier = require("../extra/verifier")

function getError(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data", "DATA": null })
}

async function generate(req, res) {
    const list = filterFetchA(req.query)

    data = list[3]
    if (!list[0]){
        res.json({"ERROR":true, "ERRCODE": list[1], "DESC": list[2], "DATA":null})
    } else {
        const yy = await verifyData.verifygenerateCracks(data[0], data[1])
        res.json({
            "ERROR" :yy[0], 
            "ERRCODE" : yy[1], 
            "DESC": yy[2], 
            "DATA": yy[3]
        })
    }
}

function filterFetchA(r){
    isMailExists = false
    isValidEmail = false;
    isUserIDExists = false; 
    var rStr = "Please Provide "
    var ERRCODESTR = "PROVIDE"   
    
    if (r.userid) { isUserIDExists = true } else { rStr += " userid"; ERRCODESTR += "_USERID" }

    if (r.mail) {
        isMailExists = true
        if (verifier.verifyMail(r.mail)){
            isValidEmail = true;
        } else {
            rStr += " Valid Mail,"; ERRCODESTR += "_VALIDMAIL"
        }
    } else {
        rStr += " mail"; ERRCODESTR += "_MAIL"
    }

    if (isUserIDExists && isMailExists && isValidEmail) { 
        { return [true, "NO_ERROR", null, [r.userid, r.mail]] }
    } else {
        { return [false, ERRCODESTR, rStr, null] }
    }
}

async function verifyotp(req, res){
    list = filterFetchB(req.query)

    data = list[3]
    if (!list[0]){
        res.json({"ERROR":true, "ERRCODE": list[1], "DESC": list[2], "DATA":null})
    } else {
        const yy = await verifyData.verifyotpCracks(data[0], data[1], data[2])
        console.log(yy)
        res.json({
            "ERROR" :yy[0], 
            "ERRCODE" : yy[1], 
            "DESC": yy[2], 
            "DATA": yy[3]
        })
    }
}

function filterFetchB(r){
    isUserIDExists = false; 
    isVTokenExists = false;
    isOTPExists = false;

    var rStr = "Provide"
    var ERRCODESTR = "PROVIDE" 
    
    if (r.userid) { isUserIDExists = true } else { rStr += " userid"; ERRCODESTR += "_USERID" }

    if (r.vtoken) { isVTokenExists = true} else { rStr += " vtoken"; ERRCODESTR += "_VTOKEN" }

    if(r.otp) { isOTPExists = true} else { rStr += " otp"; ERRCODESTR += "_OTP" }

    if (isUserIDExists && isVTokenExists && isOTPExists) { 
        { return [true, "NO_ERROR", null, [r.userid, r.vtoken, r.otp]] }
    } else {
        { return [false, ERRCODESTR, rStr, null] }
    }
}

function notAllowed(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA": null })
}

module.exports = { getError, generate, verifyotp, notAllowed }