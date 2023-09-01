const forgotpasswordData = require("../models/forgotpasswordData")
const verifier = require("../extra/verifier")

function getError(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data", "DATA": null })
}

async function forgot(req, res) {
    data = filterFetchv1(req.query)

    if (!data[0]){
        res.json({
            "ERROR": data[0],
            "ERRCODE": data[1],
            "DESC": data[2],
            "DATA": null
        })
    } else {
        const yy = await forgotpasswordData.fpotpCracks(data[3][0], data[3][1], data[3][2])
        if (!yy[0]){
            res.json({
                "ERROR": yy[0],
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": yy[0],
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": {
                    "fpToken" : yy[3][0]
                }
            })
        }
    }

    if (!list[0]){
        console.log(false)
    } else {
        const yy = await forgotpasswordData.fpgenerateCracks(data[0], data[1], data[2])
        res.json(yy)
    }
}

function filterFetchv1(r) {
    var isMailExist = false;
    var isValidMail = false;
    var isUsernameExist = false;
    var isValidUsername = false;
    var isTokenExist = false;

    rStr = "Provide"
    ERRCODESTR = "PROVIDE"

    if (r.username) {
        isUsernameExist = true;
        if (verifier.verifyUserName(r.username)) {
            isValidUsername = true;
        }
    } 

    if (r.mail) {
        isMailExist = true;
        if (verifier.verifyMail(r.mail)) {
            isValidMail = true;
        } 
    } 

    if (r.token) {
        isTokenExist = true
    }

    a = false;
    ERRCODESTR = "PROVIDE"

    if (isUsernameExist && isMailExist){
        if (isValidUsername && isValidMail){
            a = true; ERRCODESTR = "NO_ERROR"; rStr = null; data = [r.username, r.mail, null]
        }
        if (!isValidUsername){
            ERRCODESTR += "_VALIDUSERNAME"; rStr += " Valid Username,"; data = null
        }
        if (!isValidMail){
            ERRCODESTR += "_VALIDMAIL"; rStr += " Valid Mail,"; data = null
        }
    } else if (isUsernameExist) {
        if (isValidUsername){
            if (isTokenExist){
                a = true; ERRCODESTR = "NO_ERROR"; rStr = null; data = [r.username, null, r.token]
            } else {
                ERRCODESTR += "_MAIL_OR_TOKEN"; rStr += " mail or token"; data = null
            }
        } else {
            if (isTokenExist){
                ERRCODESTR += "_VALIDUSERNAME"; rStr += " valid username"; data = null
            } else {
                ERRCODESTR += "_VALIDUSERNAME_AND_TOKEN_OR_MAIL"; rStr += " valid username and token or mail"; data = null
            }
        }
    } else if (isMailExist){
        if (isValidMail){
            if (isTokenExist){
                a = true; ERRCODESTR = "NO_ERROR"; rStr = null; data = [null, r.mail, r.token]
            } else {
                ERRCODESTR += "_USERNAME_OR_TOKEN"; rStr += " username or token"; data = null
            }
        } else {
            if (isTokenExist){
                ERRCODESTR += "_VALIDMAIL"; rStr += " valid mail"; data = null
            } else {
                ERRCODESTR += "_VALIDMAIL_AND_TOKEN_OR_MAIL"; rStr += " valid mail and token or mail"; data = null
            }
        }

    } else {
        a = false; ERRCODESTR += "_MAIL_AND_USERNAME"; rStr = null; data = null;
    }
    return [a, ERRCODESTR, rStr, data]
}

async function verify_otp(req, res) {
    data = filterFetchv2(req.query)

    if (!data[0]){
        res.json({
            "ERROR": data[0],
            "ERRCODE": data[1],
            "DESC": data[2],
            "DATA": null
        })
    } else {
        const yy = await forgotpasswordData.fpotpCracks(data[3][0], data[3][1])
        if (!yy[0]){
            res.json({
                "ERROR": yy[0],
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": yy[0],
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": {
                    "fpPassToken" : yy[3][0]
                }
            })
        }
    }
}


function filterFetchv2(r) {
    var isfpTokenExist = false;
    var isOTPHashExist = false;

    rStr = "Provide "
    ERRCODESTR = "PROVIDE"

    if(r.fptoken){
        isfpTokenExist = true;
    } else {
        rStr += "fptoken"; ERRCODESTR += "_FPTOKEN";
    }
    if (r.otp){
        isOTPHashExist = true;
    } else {
        rStr += "otp"; ERRCODESTR += "_OTP";
    }
    if (isfpTokenExist && isOTPHashExist){
        return [true, "NO_ERROR", null, [r.fptoken, r.otp]]
    } else {
        return [false, ERRCODESTR, r, null]
    }
}

async function forgot_passwowrd(req, res) {
    data = filterFetchv3(req.query)

    if (!data[0]){
        res.json({
            "ERROR": data[0],
            "ERRCODE": data[1],
            "DESC": data[2],
            "DATA": null
        })
    } else {
        const yy = await forgotpasswordData.fpUpdatePasswordCracks(data[3][0], data[3][1])
        if (!yy[0]){
            res.json({
                "ERROR": yy[0],
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": null
            })
        } else {
            res.json({
                "ERROR": yy[0],
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": {
                    "fpPassToken" : yy[3][0]
                }
            })
        }
    }
}

function filterFetchv3(r) {
    var isfpTokenExist = false;
    var isPasswordExist = false;

    rStr = "Provide "
    ERRCODESTR = "PROVIDE"

    if(r.fptoken){
        isfpTokenExist = true;
    } else {
        rStr += " fptoken"; ERRCODESTR += "_FPTOKEN";
    }
    if (r.password){
        isPasswordExist = true;
    } else {
        rStr += " password"; ERRCODESTR += "_PASSWORD";
    }
    if (isfpTokenExist && isPasswordExist){
        return [true, "NO_ERROR", null, [r.fptoken, r.password]]
    } else {
        return [false, ERRCODESTR, r, null]
    }
}


function notAllowed(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA": null })
}

module.exports = { getError, forgot, notAllowed }