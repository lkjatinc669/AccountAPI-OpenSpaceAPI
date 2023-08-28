const signupData = require("../models/signupData")

function getError(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data", "DATA":null })
}

function main(req, res) {
    
    filter(req.query)





    if (!final) {
        res.json({ "ERROR": true, "desc": resString })
    } else {
        if (req.query.password.length < 40) {
            res.json({
                "ERROR": true,
                "desc": "Password Length is less than 40 Chars. Please use Hashing Algorithm for Encrypting Password"
            })
        } else {
            async function a() {
                var resList = await signupData(req.query.email, req.query.username, req.query.password)
                res.json({
                    "ERROR": false,
                    "desc": "none",
                    "data": {
                        "id": resList[0],
                        "email": resList[1],
                        "username": resList[2],
                        "token": resList[3]
                    }
                })
            }
            a()
        }
    }
}

function filter(r){
    var final = false

    var rStr = "Please Provide"
    var ERRCODE = "ERR"
    
    var isFNameExist = false;
    var isLNameExist = false;
    var isEmailExist = false
    var isUsernameExist = false;
    var isPasswordExist = false;

    if (r.fname) {isFNameExist = true} else {rStr += " First Name"; }


    if (req.email) { isEmailExists = true } else { resString += " email" }
    if (req.username) { isUsernameExists = true } else { resString += " username" }
    if (req.password) { isPasswordExist = true } else { resString += " password" }


    if (isEmailExists && isUsernameExists && isPasswordExist) { final = true }

    return (s)
}




function notAllowed(req, res){
    res.json({"ERROR":true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA":null})
}


module.exports = { getError, main, notAllowed }