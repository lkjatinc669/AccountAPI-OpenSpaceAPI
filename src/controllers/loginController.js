const loginData = require("../models/loginData")

function getError(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data", "DATA":null })
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
        res.json({ "ERROR": true, "DESC": resString })
    } else {
        async function a() {
            var resList = await loginData(req.query.type, req.query.data, req.query.password)
            res.json({
                "ERROR": false,
                "DESC": null,
                "DATA": resList
            })
        }
        a()
    }
}

function filterFetch(){

}

function notAllowed(req, res){
    res.json({"ERROR":true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA":null})
}

module.exports = { getError, main, notAllowed }