const verifyData = require("../models/verifyData")

function getError(req, res) {
    res.json({ "ERROR": "true", "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data" })
}

function generate(req, res) {
    var final = false
    var isUserIDExists = isMailExists = false
    var resString = "Please Provide "
    var ERRCODESTR = "PROVIDE"
    if (req.query.userid) { isUserIDExists = true } else { resString += " userid"; ERRCODESTR += "_USERID" }
    if (req.query.mail) { isMailExists = true } else { resString += " mail"; ERRCODESTR += "_MAIL" }

    if (isUserIDExists && isMailExists) { final = true }

    if (!final) {
        res.json({ "ERROR": "true", "ERRCODE": ERRCODE, "DESC": resString })
    } else {
        (async () => {
            var result = await verifyData.verifygenerateCracks()
            res.json({ "ERROR": "true", "DESC": resString })
        })()
    }
    res.json(req.query)
}

function generateHelperController(){

}

function verifyotp(req, res) {
    //
}

function verifyotpHelperController(){
    
}

function notAllowed(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA": "none" })
}

module.exports = { getError, generate, verifyotp, notAllowed }