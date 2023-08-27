const loginData = require("../models/loginData")

function getError(req, res) {
    res.json({ "ERROR": "true", "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data" })
}


function main(req, res) {
    var final = false

    var resString = "Please Provide"

    var isTypeExist = false;
    var isDataExist = false;
    var isPasswordExist = false;

    if (req.query.type && ["em", "un", "tk"].includes(req.query.type)) { isTypeExist = true } else { resString += " type" }
    if (req.query.data && req.query.data.length > 0) { isDataExist = true } else { resString += " data" }
    if (req.query.password && req.query.password.length !== 0) { console.log(req.query.password); isPasswordExist = true } else { console.log(false); resString += " password" }

    if (isTypeExist && isDataExist && isPasswordExist) { final = true }

    if (!final) {
        res.json({ "error": "true", "desc": resString })
    } else {
        async function a() {
            var resList = await loginData(req.query.type, req.query.data, req.query.password)
            res.json({
                "error": "false",
                "desc": "none",
                "data": resList
            })
        }
        a()
    }
}

function get(){

}

function notAllowed(req, res) {
    res.json({ "error": true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA": "none" })
}

module.exports = { getError, main, notAllowed }