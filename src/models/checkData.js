require("dotenv").config()
const connection = require("../db/connection")
const printer = require("../extra/colorPrinter")
const userTable = process.env.USERSTABLE;
const verifyTable = process.env.VERIFYTABLE;

// Main Check Username function

async function checkusernameCracks(username) {
    return await checkUsername(username)
}

// Helper Check UserName function 

async function checkUsername(username){
    QUERY = `SELECT 1=1 FROM ${userTable} where osa_userName = '${username}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

// Main Check Username function

async function checkuseridCracks(userid) {
    return await checkuserid(userid)
}

// Helper Check UserName function 

async function checkuserid(userid){
    QUERY = `SELECT 1=1 FROM ${userTable} where osa_userUnqID = '${userid}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

// Main Check Mail function

async function checkmailCracks(mail) {
    return await checkMail(mail)
}

// Helper Check Mail function 

async function checkMail(mail){
    QUERY = `SELECT 1=1 FROM ${userTable} where osa_userMail = '${mail}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

// Main Check Token function

async function checktokenCracks(token) {
    return await checkToken(token)
}

// Helper Check Token function 

async function checkToken(token){
    QUERY = `SELECT 1=1 FROM ${userTable} where osa_newToken = '${token}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

// Main Check Token function

async function checkunqidCracks(id) {
    return await checkUnqID(id)
}

// Helper Check Token function 

async function checkUnqID(id){
    QUERY = `SELECT 1=1 FROM ${userTable} where osa_userUnqID = '${id}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

module.exports = {checkuseridCracks, checkusernameCracks, checkmailCracks, checktokenCracks, checkunqidCracks}