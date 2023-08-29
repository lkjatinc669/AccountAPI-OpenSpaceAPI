const checkData = require("../models/checkData")
const mailVerifier = require("../extra/verifier")

function getError(req, res){
    res.json({ "ERROR": true, "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data", "DATA":null })
}

function checkUserName(req, res){
    if(req.query.username){
        (async ()=>{
            aa = await checkData.checkusernameCracks(req.query.username)
            res.json({"ERROR":false, "ERRCODE": "NO_ERROR", "DESC": null, "DATA":aa})
        })();
    } else {
        res.json({"ERROR":true, "ERRCODE": "PROVIDE_USERNAME", "DESC": "Provide 'username'", "DATA":null})
    }
}

function checkUserID(req, res){
    if(req.query.userid){
        (async ()=>{
            aa = await checkData.checkuseridCracks(req.query.userid)
            res.json({"ERROR":false, "ERRCODE": "NO_ERROR", "DESC": null, "DATA":aa})
        })();
    } else {
        res.json({"ERROR":true, "ERRCODE": "PROVIDE_USERID", "DESC": "Provide 'userid'", "DATA":null})
    }
}

function checkMail(req, res){
    if(req.query.mail){
        if (mailVerifier.verifyMail(req.query.mail)){
            (async ()=>{
                aa = await checkData.checkmailCracks(req.query.mail)
                res.json({"ERROR":false, "ERRCODE": "NO_ERROR", "DESC": null, "DATA":aa})
            })();
        } else {
            res.json({"ERROR":true, "ERRCODE": "INVALID_MAIL", "DESC": "Invalid mail provided", "DATA":null})
        }
    } else {
        res.json({"ERROR":true, "ERRCODE": "PROVIDE_MAIL", "DESC": "Provide 'mail'", "DATA":null})
    }
}

function notAllowed(req, res){
    res.json({"ERROR":true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA":null})
}

module.exports = { getError, checkUserName, checkUserID, checkMail, notAllowed}