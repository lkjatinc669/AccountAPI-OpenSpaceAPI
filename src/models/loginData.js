require("dotenv").config()
const connection = require("../db/connection")
const generator = require("../extra/generators")
const checkers = require("./checkData")
const printer = require("../extra/colorPrinter")

const userTable = process.env.USERSTABLE;
const verifyTable = process.env.VERIFYTABLE;

async function loginwithtokenCracks(type, data, token, password) {
    var yy = await baseLogin(type, data, password);
    a = false;
    data = null;
    if (yy[0] == 0) {
        ERRCODESTR = "NO_USER_FOUND";
        r = "Invalid Username or Password";
    } else if (yy[0] == 1) {
        if (token == yy[1][0]['osa_newToken']) {
            yy = yy[1][0]
            a = true;
            ERRCODESTR = "USER_LOGIN_SUCCESSFUL_WITH_TOKEN_NO_CHANGE";
            r = "User Successfully Verified with Token with No change";
            data = [
                yy['osa_userUnqID'],
                yy['osa_firstName'],
                yy['osa_lastName'],
                yy['osa_userMail'],
                yy['osa_userName'],
                yy['osa_passWord'],
                yy['osa_pPicURL'],
                yy['osa_newToken'],
                yy['osa_isVerified']
            ]
        } else {
            var yz = await updatetokenCracks(yy[1][0]['osa_userUnqID'], yy[1][0]['osa_newToken'])
            console.log(yz)
            if (yz[0] == true) {
                a = true;
                ERRCODESTR = "USER_LOGIN_SUCCESSFUL_WITH_TOKEN_WITH_CHANGE_SUCCESS";
                r = "User Successfully Verified with Token with change";
                data = [
                    yy[1][0]['osa_userUnqID'],
                    yy[1][0]['osa_firstName'],
                    yy[1][0]['osa_lastName'],
                    yy[1][0]['osa_userMail'],
                    yy[1][0]['osa_userName'],
                    yy[1][0]['osa_passWord'],
                    yy[1][0]['osa_pPicURL'],
                    yz[1],
                    yy[1][0]['osa_isVerified']
                ]
            } else {
                ERRCODESTR = "USER_LOGIN_SUCCESSFUL_WITH_TOKEN_WITH_CHANGE_ERROR";
                r = "User Successfully Verified But Error in Token ";
                data = null;
            }
        }
    } else if (yy[0] > 1) {
        ERRCODESTR = "MULTIPLE_USER_FOUND";
        r = "Multiple User Accounts Found";
    }
    return [a, ERRCODESTR, r, data]
}


async function loginwithouttokenCracks(type, data, password) {
    var yy = await baseLogin(type, data, password);
    a = false;
    data = null;
    if (yy[0] == 0) {
        ERRCODESTR = "NO_USER_FOUND";
        r = "Invalid Username or Password";
    } else if (yy[0] == 1) {
        const yz = await updatetokenCracks(yy[1][0]['osa_userUnqID'], yy[1][0]['osa_newToken'])
        if (yz[0] == true) {
            a = true;
            ERRCODESTR = "USER_LOGIN_SUCCESSFUL_NO_TOKEN_NEW_TOKEN_PROVIDED";
            r = "User Successfully Verified with Token with change";
            data = [
                yy[1][0]['osa_userUnqID'],
                yy[1][0]['osa_firstName'],
                yy[1][0]['osa_lastName'],
                yy[1][0]['osa_userMail'],
                yy[1][0]['osa_userName'],
                yy[1][0]['osa_passWord'],
                yy[1][0]['osa_pPicURL'],
                yz[1],
                yy[1][0]['osa_isVerified']
            ]
        } else {
            ERRCODESTR = "USER_LOGIN_SUCCESSFUL_NO_TOKEN_WITH_CHANGE_ERROR";
            r = "User Successfully Verified with Token with change";
            data = null;
        }
    } else if (yy[0] > 1) {
        ERRCODESTR = "MULTIPLE_USER_FOUND";
        r = "Multiple User Accounts Found";
    }
    return [a, ERRCODESTR, r, data]
}

async function updatetokenCracks(id, token) {
    var genToken = generator(30)
    tokenExist = checkers.checktokenCracks(genToken)

    while (tokenExist) { genToken = generator(30); var tokenExist = await checkers.checktokenCracks(genToken) }

    QUERY = `UPDATE ${userTable} SET 
    osa_oldToken='${token}', osa_newToken='${genToken}'
    WHERE osa_userUnqID='${id}'`
    console.log(QUERY)
    const [psDataset] = await connection.query(QUERY)
        .catch(error => console.log(error));
    // console.log(dataSet)
    if (psDataset["affectedRows"] == 1) { data = true; } else { data = false }
    console.log(data, genToken)
    return [data, genToken]
}

async function baseLogin(type, data, password) {
    var QUERY = `SELECT * FROM ${userTable} WHERE`
    if (type == "em") { QUERY += ` osa_userMail='${data}'` }
    else if (type == "un") { QUERY += ` osa_userName='${data}'` }
    QUERY += ` AND osa_passWord='${password}'`

    const [dataSet] = await connection.query(QUERY)
        .catch(error => console.log(error));

    return [dataSet.length, dataSet]
}

module.exports = { loginwithtokenCracks, loginwithouttokenCracks }