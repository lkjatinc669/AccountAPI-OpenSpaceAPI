const signupData = require("../models/signupData")

function getError(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data", "DATA":null })
}

function main(req, res) {
    
    const _data = filterFetch(req.query)




    // [r.fname, r.lname, r.email, r.username, r.password]
    if (!_data[0]) {
        res.json({"ERROR":true, "ERRCODE": _data[1], "DESC": _data[2], "DATA":null})
    } else {
        if (req.query.password.length < 40) {
            res.json({
                "ERROR": true,
                "ERRCODE": "INVALID_PASSWORD_LENGTH",
                "DESC": "Password Length is less than 40 Chars. Please use Hashing Algorithm for Encrypting Password",
                "DATA": null
            })
        } else {
            (async () => {
                var resList = await signupData(_data[0], _data[1], _data[2], _data[3], _data[4])
                res.json({
                    "ERROR": false,
                    "ERRCODE": "NO_ERROR",
                    "DESC": null,
                    "DATA": {
                        "id": resList[0],
                        "fname": resList[1],
                        "lname": resList[2],
                        "email": resList[3],
                        "username": resList[4],
                        "profileurl": resList[5],
                        "token": resList[6],
                        "isverified": resList[7]
                    }
                })
            })();
        }
    }
}

function filterFetch(r){
    var rStr = "Please Provide"
    var ERRCODESTR = "PROVIDE"
    
    var isFNameExist = false;
    var isLNameExist = false;
    var isEmailExist = false
    var isUsernameExist = false;
    var isPasswordExist = false;

    if (r.fname) {isFNameExist = true} else {rStr += " First Name"; ERRCODESTR += "_FNAME"}
    if (r.lname) {isLNameExist = true} else {rStr += " Last Name"; ERRCODESTR += "_LNAME"}
    if (r.email) {isEmailExist = true} else {rStr += " Email"; ERRCODESTR += "_EMAIL"}
    if (r.username) {isUsernameExist = true} else {rStr += " Username"; ERRCODESTR += "_USERNAME"}
    if (r.password) {isPasswordExist = true} else {rStr += " Password"; ERRCODESTR += "_PASSWORD"}

    rStr = rStr.slice(0, rStr.length-1)
    rStr += " Fields"

    if ( isFNameExist && isLNameExist && isEmailExist && isUsernameExist && isPasswordExist ) 
    { return [true, "NO_ERROR", null, [r.fname, r.lname, r.email, r.username, r.password]] }
    else { return [false, ERRCODESTR, rStr, null] }
}

function notAllowed(req, res){
    res.json({"ERROR":true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA":null})
}


module.exports = { getError, main, notAllowed }