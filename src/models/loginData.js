require("dotenv").config()
const connection = require("../db/connection")
const generator = require("../extra/generators")
const checkers = require("./checkData")
const printer = require("../extra/colorPrinter")

const userTable = process.env.USERSTABLE;
const verifyTable = process.env.VERIFYTABLE;

async function loginwithtokenCracks(type, data, token, password) {
    var yy = await baseLogin(type, data, password);
    a=false;
    data = null;
    if (yy[0] == 0) {
        ERRCODESTR = "NO_USER_FOUND";
        r = "Invalid Username or Password";
    } else if(yy[0] == 1){
        if (token == yy[1][0]['newToken']){
            a = true;
            yy = yy[1][0]
            ERRCODESTR = "USER_LOGIN_SUCCESSFUL_WITH_TOKEN_NO_CHANGE";
            r = "User Successfully Verified with Token with No change";
            data = [
                yy['id'], 
                yy['firstName'], 
                yy['lastName'], 
                yy['email'], 
                yy['username'], 
                yy['password'], 
                yy['profileURL'], 
                yy['newToken'], 
                yy['isVerified']
            ]
        } else {
            var yz = await updatetokenCracks(yy[1][0]['id'], yy[1][0]['newToken'])
            console.log(yz)
            if (yz[0] == true){
                a=true;
                ERRCODESTR = "USER_LOGIN_SUCCESSFUL_WITH_TOKEN_WITH_CHANGE_SUCCESS";
                r = "User Successfully Verified with Token with change";
                data = [
                    yy[1][0]['id'], 
                    yy[1][0]['firstName'], 
                    yy[1][0]['lastName'], 
                    yy[1][0]['email'], 
                    yy[1][0]['username'], 
                    yy[1][0]['password'], 
                    yy[1][0]['profileURL'], 
                    yz[1], 
                    yy[1][0]['isVerified']
                ]
            } else {
                ERRCODESTR = "USER_LOGIN_SUCCESSFUL_WITH_TOKEN_WITH_CHANGE_ERROR";
                r = "User Successfully Verified But Error in Token ";
                data = null;
            }
        }
    } else if(yy[0] > 1){
        ERRCODESTR = "MULTIPLE_USER_FOUND";
        r = "Multiple User Accounts Found";
    }
    return [a, ERRCODESTR, r, data]
}


async function loginwithouttokenCracks(type, data, password) {
    var yy = await baseLogin(type, data, password);
    a=false;
    data = null;
    if (yy[0] == 0) {
        ERRCODESTR = "NO_USER_FOUND";
        r = "Invalid Username or Password";
    } else if(yy[0] == 1){
        const yz = await updatetokenCracks(yy[1][0]['id'], yy[1][0]['newToken'])
        if (yz[0] == true){
            a=true;
            ERRCODESTR = "USER_LOGIN_SUCCESSFUL_NO_TOKEN_NEW_TOKEN_PROVIDED";
            r = "User Successfully Verified with Token with change";
            data = [
                yy[1][0]['id'], 
                yy[1][0]['firstName'], 
                yy[1][0]['lastName'], 
                yy[1][0]['email'], 
                yy[1][0]['username'], 
                yy[1][0]['password'], 
                yy[1][0]['profileURL'], 
                yz[1], 
                yy[1][0]['isVerified']
            ]
        } else {
            ERRCODESTR = "USER_LOGIN_SUCCESSFUL_NO_TOKEN_WITH_CHANGE_ERROR";
            r = "User Successfully Verified with Token with change";
            data = null;
        }
    } else if(yy[0] > 1){
        ERRCODESTR = "MULTIPLE_USER_FOUND";
        r = "Multiple User Accounts Found";
    }
    return [a, ERRCODESTR, r, data]
}

function aa( data, data2){
    console.log(data, data2)
}

async function updatetokenCracks(id, token){
    var genToken = generator(30)
    tokenExist = checkers.checktokenCracks(genToken)
    
    while (tokenExist) { genToken = generator(30); var tokenExist = await checkers.checktokenCracks(genToken) }

    QUERY = `UPDATE ${userTable} SET 
    oldToken='${token}', newToken='${genToken}'
    WHERE id='${id}'`
    console.log(QUERY)
    const [psDataset] = await connection.query(QUERY)
        .catch(error => console.log(error));
    // console.log(dataSet)
    if (psDataset["affectedRows"] == 1){ data = true; } else { data = false }
    console.log(data, genToken)
    return  [data, genToken]
}

async function baseLogin(type, data, password) {
    var QUERY = `SELECT * FROM ${userTable} WHERE`
    if (type=="em") { QUERY += ` email='${data}'`}
    else if (type=="un") { QUERY += ` username='${data}'`}
    QUERY += ` AND password='${password}'`

    const [dataSet] = await connection.query(QUERY)
        .catch(error => console.log(error));
        
    return [dataSet.length, dataSet]
}

module.exports = { loginwithtokenCracks, loginwithouttokenCracks }