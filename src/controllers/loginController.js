const loginData = require("../models/loginData")
const verifier = require("../extra/verifier")

function getError(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data", "DATA": null })
}


function main(req, res) {
    var list = filterFetch(req.query);
    // console.log(list)
    data = list[3];
    if (!list[0]){
        res.json({ "ERROR": true, "ERRCODE": list[1], "DESC": list[2] , "DATA":null})
    } else {
        if(data[2] == null){
            (async () => {
                var yy = await loginData.loginwithouttokenCracks(data[0], data[1], data[3])
                if (!yy[0]){
                    res.json({ "ERROR":true, "ERRCODE":yy[1], "DESC":yy[2], "DATA":yy[3] })
                } else {
                    res.json({ "ERROR":false, "ERRCODE":yy[1], "DESC":yy[2], "DATA":{
                        "id" : yy[3][0],
                        "fname" : yy[3][1],
                        "lname" : yy[3][2],
                        "mail" : yy[3][3],
                        "username" : yy[3][4],
                        "profilepic" : yy[3][6],
                        "token" : yy[3][7],
                        "isverified" : yy[3][8],
                    }})
                }
                console.log(yy)
            })();
        } else {
            (async () => {
                var yy = await loginData.loginwithtokenCracks(data[0], data[1], data[2], data[3])
                if (!yy[0]){
                    res.json({ "ERROR":true, "ERRCODE":yy[1], "DESC":yy[2], "DATA":yy[3] })
                } else {
                    res.json({ "ERROR":false, "ERRCODE":yy[1], "DESC":yy[2], "DATA":{
                        "id" : yy[3][0],
                        "fname" : yy[3][1],
                        "lname" : yy[3][2],
                        "mail" : yy[3][3],
                        "username" : yy[3][4],
                        "profilepic" : yy[3][6],
                        "token" : yy[3][7],
                        "isverified" : yy[3][8],
                    }})
                }
                console.log(yy)
            })();
        }
    }
}

function z(a) { console.log(a) }

function filterFetch(r) {
    var rStr = "Please Provide "
    var ERRCODESTR = "PROVIDE"
    console.log("------------------------------")
    var isTypeExist = false;
    var isValidTypeExist = false;
    var isDataExist = false;
    var isValidDataExist = false;
    var isTokenExist = false;
    var isPasswordExist = false;
    if (r.type) {
        if (r.type == "em" || r.type == "un") {
            isTypeExist = true
            isValidTypeExist = true
        } else {
            rStr += " Valid Type,"; ERRCODESTR += "_VALIDTYPE"
        }
    } else {
        rStr += " Type,"; ERRCODESTR += "_TYPE"
    }

    if (r.data) {
        if (r.data && isTypeExist) {
            if (r.type == "un") {
                if (verifier.verifyUserName(r.data)) {
                    isDataExist = true;
                    isValidDataExist = true;
                } else {
                    rStr += " Valid Username,"; ERRCODESTR += "_VALIDUSERNAME"
                }
            } else if (r.type == "em") {
                if (verifier.verifyMail(r.data)) {
                    isDataExist = true;
                    isValidDataExist = true;
                } else {
                    rStr += " Valid Mail,"; ERRCODESTR += "_INVALIDEMAIL"
                }
            }
        }
    } else {
        rStr += " Data,"; ERRCODESTR += "_DATA"
    }

    if (r.password) {
        isPasswordExist = true
    } else {
        rStr += " Password,"; ERRCODESTR += "_PASSWORD"
    }

    if (r.token && r.token != '') { token = r.token } else { token = null }

    rStr = rStr.slice(0, rStr.length - 1)
    rStr += " Fields"

    if (isTypeExist && isValidTypeExist && isDataExist && isValidDataExist && isPasswordExist) {
        return [true, "NO_ERROR", null, [r.type, r.data, token, r.password]]
    } else {
        return [false, ERRCODESTR, rStr, null]
    }
}

function notAllowed(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA": null })
}

module.exports = { getError, main, notAllowed }