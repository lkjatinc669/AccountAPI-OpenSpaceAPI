require("dotenv").config()
const connection = require("../db/connection")
const printer = require("../extra/colorPrinter")
const userTable = process.env.USERSTABLE;
const verifyTable = process.env.VERIFYTABLE;

// Main Check Username function

async function checkusernameCracks(username) {
    QUERY = `SELECT 1=1 FROM ${userTable} where osa_userName = '${username}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

// Main Check Username function

async function checkuseridCracks(userid) {
    QUERY = `SELECT 1=1 FROM ${userTable} where osa_userUnqID = '${userid}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

// Main Check Mail function

async function checkmailCracks(mail) {
    QUERY = `SELECT 1=1 FROM ${userTable} where osa_userMail = '${mail}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

// Main Check Token function

async function checktokenCracks(token) {
    QUERY = `SELECT 1=1 FROM ${userTable} where osa_newToken = '${token}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

// Main Check Token function

async function checkunqidCracks(id) {
    QUERY = `SELECT 1=1 FROM ${userTable} where osa_userUnqID = '${id}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

module.exports = {checkuseridCracks, checkusernameCracks, checkmailCracks, checktokenCracks, checkunqidCracks}