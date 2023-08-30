const signupData = require("../models/signupData")
const verifier = require("../extra/verifier")

function getError(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data", "DATA":null })
}

async function main(req, res) {
    
    const list = filterFetch(req.query)
    res.json(list)
    // signupCracks(fname, lname, mail, username, password)
    data = list[3]
    if(!list[0]){
        res.json({"ERROR":true, "ERRCODE": list[1], "DESC": list[2], "DATA":null})
    } else {
        // yy = await signupData.signupCracks(data[0], data[1], data[2], data[3], data[4]) 
        yy = await signupData.signupCracks(data[0], data[1], data[2], data[3], data[4])
        if (!yy[0]){
            res.json({
                "ERROR" : false,
                "ERRCODE": "NOERROR",
                "DESC": null,
                "DATA": {
                    "id" : yy[3][0],
                    "fname" : yy[3][1],
                    "lname" : yy[3][2],
                    "mail" : yy[3][3],
                    "username" : yy[3][4],
                    "profilepic" : yy[3][6],
                    "token" : yy[3][7],
                    "isverified" : yy[3][8],
                }
            })
        } else {
            res.json({
                "ERROR" : true,
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA":null
            })
        }
    }

    // // [r.fname, r.lname, r.email, r.username, r.password]
    // if (!_data[0]) {
    //     res.json({"ERROR":true, "ERRCODE": _data[1], "DESC": _data[2], "DATA":null})
    // } else {
    //     if (req.query.password.length < 40) {
    //         res.json({
    //             "ERROR": true,
    //             "ERRCODE": "INVALID_PASSWORD_LENGTH",
    //             "DESC": "Password Length is less than 40 Chars. Please use Hashing Algorithm for Encrypting Password",
    //             "DATA": null
    //         })
    //     } else {
    //         (async () => {
    //             var resList = await signupData(_data[0], _data[1], _data[2], _data[3], _data[4])
    //             res.json({
    //                 "ERROR": false,
    //                 "ERRCODE": "NO_ERROR",
    //                 "DESC": null,
    //                 "DATA": {
    //                     "id": resList[0],
    //                     "fname": resList[1],
    //                     "lname": resList[2],
    //                     "email": resList[3],
    //                     "username": resList[4],
    //                     "profileurl": resList[5],
    //                     "token": resList[6],
    //                     "isverified": resList[7]
    //                 }
    //             })
    //         })();
    //     }
    // }
}

function filterFetch(r){
    var rStr = "Please Provide"
    var ERRCODESTR = "PROVIDE"
    
    var isFNameExist = false;
    var isValidFName = false;
    var isLNameExist = false;
    var isValidLName = false;
    var isEmailExist = false;
    var isValidEmail = false;
    var isUsernameExist = false;
    var isValidUsername = false;
    var isPasswordExist = false;
    var isValidPassword = false;

    if (r.fname) {
        if(verifier.verifyName(r.fname)){
            isValidFName = true;
        } else {
            rStr += " Valid First Name,"; ERRCODESTR += "_VALIDFNAME"
        }
        isFNameExist = true
    } else {
        rStr += " First Name,"; ERRCODESTR += "_FNAME"
    }
    if (r.lname) {
        isLNameExist = true
        if (verifier.verifyName(r.lname)){
            isValidLName = true;
        } else {
            rStr += " Valid Last Name,"; ERRCODESTR += "_VALIDLNAME"
        }
    } else {
        rStr += " Last Name,"; ERRCODESTR += "_LNAME"
    }

    if (r.mail) {
        isEmailExist = true
        if (verifier.verifyMail(r.mail)){
            isValidEmail = true;
        } else {
            rStr += " Valid Mail,"; ERRCODESTR += "_VALIDMAIL"
        }
    } else {
        rStr += " Mail,"; ERRCODESTR += "_MAIL"
    }

    if (r.username) {
        isUsernameExist = true
        if (verifier.verifyUserName(r.username)){
            isValidUsername = true
        } else {
            rStr += " Valid Username,"; ERRCODESTR += "_VALIDUSERNAME"
        }
    } else {
        rStr += " Username,"; ERRCODESTR += "_USERNAME"
    }
    if (r.password) {
        isPasswordExist = true
        if (verifier.verifyPassword(r.password)){
            isValidPassword = true
        } else {
            rStr += " Valid Password,"; ERRCODESTR += "_VALIDPASSWORD"
        }
    } else {
        rStr += " Password,"; ERRCODESTR += "_PASSWORD"
    }

    rStr = rStr.slice(0, rStr.length-1)
    rStr += " Fields"

    if ( isFNameExist && isValidFName && isLNameExist && isValidLName && isEmailExist && isValidEmail && isUsernameExist && isValidUsername && isPasswordExist && isValidPassword ) 
    { return [true, "NO_ERROR", null, [r.fname, r.lname, r.mail, r.username, r.password]] }
    else { return [false, ERRCODESTR, rStr, null] }
}

function notAllowed(req, res){
    res.json({"ERROR":true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA":null})
}

module.exports = { getError, main, notAllowed }