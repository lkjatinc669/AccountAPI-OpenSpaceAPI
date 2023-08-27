const checkData = require("../models/checkData")
const mailVerifier = require("../extra/mail-verifier")

function getError(req, res){
    res.json({ "ERROR": "true", "ERRCODE":"GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data" })
}

function checkUserName(req, res){
    if(req.query.username){
        (async ()=>{
            aa = await checkData.checkusernameCracks(req.query.username)
            res.json({"ERROR":false, "ERRCODE": "NO_ERROR", "DESC": "none", "DATA":aa})
        })();
    } else {
        res.json({"ERROR":true, "ERRCODE": "PROVIDE_USERNAME", "DESC": "Provide 'username'", "DATA":"none"})
    }
}

function checkUserID(req, res){
    if(req.query.userid){
        (async ()=>{
            aa = await checkData.checkuseridCracks(req.query.userid)
            res.json({"ERROR":false, "ERRCODE": "NO_ERROR", "DESC": "none", "DATA":aa})
        })();
    } else {
        res.json({"ERROR":true, "ERRCODE": "PROVIDE_USERID", "DESC": "Provide 'userid'", "DATA":"none"})
    }
}

function checkMail(req, res){
    if(req.query.mail){
        if (mailVerifier.verifyMail(req.query.mail)){
            (async ()=>{
                aa = await checkData.checkmailCracks(req.query.mail)
                res.json({"ERROR":false, "ERRCODE": "NO_ERROR", "DESC": "none", "DATA":aa})
            })();
        } else {
            res.json({"ERROR":true, "ERRCODE": "INVALID_MAIL", "DESC": "Invalid mail provided", "DATA":"none"})
        }
    } else {
        res.json({"ERROR":true, "ERRCODE": "PROVIDE_MAIL", "DESC": "Provide 'mail'", "DATA":"none"})
    }
}

function notAllowed(req, res){
    res.json({"ERROR":true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA":"none"})
}

module.exports = { getError, checkUserName, checkUserID, checkMail, notAllowed}