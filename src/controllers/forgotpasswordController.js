const forgotpasswordData = require("../models/forgotpasswordData")
const verifier = require("../extra/verifier")

function getError(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data", "DATA": null })
}

async function main(req, res) {
    list = filterFetch(req.query)
    data = list[3]

    if (!list[0]){
        console.log(false)
    } else {
        const yy = await forgotpasswordData.fpgenerateCracks(data[0], data[1], data[2])
        // console.log(yy)
    }
    res.json("Conver")
}





function filterFetch(r) {
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



function notAllowed(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA": null })
}

module.exports = { getError, main, notAllowed }