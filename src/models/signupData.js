const connection = require("../db/connection")
const generator = require("../extra/generators")
const printer = require("../extra/colorPrinter")
const checkers = require("./checkData")
const userTable = process.env.USERSTABLE;
const verifyTable = process.env.VERIFYTABLE;

async function signupCracks(fname, lname, mail, username, password) {
    var id = generator(20)
    var idExist = checkers.checkunqidCracks(id)
    while (idExist) { id = generator(20); idExist = await checkers.checktokenCracks(id) }

    var genToken = generator(30)
    var tokenExist = checkers.checktokenCracks(genToken)
    while (tokenExist) { genToken = generator(30); tokenExist = await checkers.checktokenCracks(genToken) }

    var res = await baseSignup(id, fname, lname, username, mail, password, genToken)
    if (res == 1){
        yy = await baseFetcher(id)
        if (yy.length == 1){
            a = true;
            ERRCODESTR = "SIGNUP_SUCCESSFUL_NO_ERROR"
            r = "Signed up successfully"
            data = [
                yy[0]['osa_userUnqID'],
                yy[0]['osa_firstName'],
                yy[0]['osa_lastName'],
                yy[0]['osa_userMail'],
                yy[0]['osa_userName'],
                yy[0]['osa_pPicURL'],
                yy[0]['osa_newToken'],
                yy[0]['osa_isVerified']
            ]
        } else {
            a = false;
            ERRCODESTR = "SIGNUP_SUCCESSFUL_RETURN_ERROR";
            r = "Signed Up successfully, but unable to return the values"
            data = null;
        }
    } else {
        a = false;
        ERRCODESTR = "ERROR_SIGNUP";
        r = "Something Went Wrong in Signup";
        data = null;
    }
    return [a, ERRCODESTR, r, data]
}

async function baseSignup(id, fname, lname, username, mail, password, token){
    const QUERY = `INSERT INTO openspaceuserstable
    (osa_userUnqID, osa_firstName, osa_lastName, osa_userMail, osa_userName, osa_passWord, osa_pPicURL, osa_oldToken, osa_newToken, osa_isVerified, osa_isDisabled) 
    VALUES 
    ('${id}','${fname}','${lname}','${mail}','${username}','${password}','${"default-profile.jpg"}','${null}','${token}','${0}','${1}')`;

    const [dataSet] = await connection.query(QUERY)
        .catch(error => printer.warning("Error "+ error));

    return dataSet["affectedRows"];
}

async function baseFetcher(id){
    const QUERY = `SELECT * FROM ${userTable} WHERE osa_userUnqID='${id}'`;

    const [dataSet] = await connection.query(QUERY)
        .catch(error => printer.warning("Error "+ error));

    return dataSet;
}

async function deleter(){
    console.log("Deleter")
    const QUERY = `DELETE FROM ${userTable} WHERE osa_userName='googlebyjg'`;
    await connection.query(QUERY)
        .catch(error => printer.warning("Error "+ error));
}


// (async ()=>{
//     await deleter()
//     res = await signupCracks("Jatin", "Gohil", "jatingohil@gmail.com", "gjatin", "jatingohil")
//     // res = await baseFetcher("000")
//     console.log(res)
//     process.exit()
// })();

// Helper Signup Function

module.exports = {signupCracks}