const connection = require("../db/connection")
const printer = require("../extra/colorPrinter")

// Main Check Username function

async function checkusernameCracks(username) {
    return await checkUsername(username)
}

// Helper Check UserName function 

async function checkUsername(username){
    QUERY = `SELECT 1=1 FROM users where username = '${username}'`;
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
    QUERY = `SELECT 1=1 FROM users where id = '${userid}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

// Main Check Username function

async function checkmailCracks(mail) {
    return await checkMail(mail)
}

// Helper Check UserName function 

async function checkMail(mail){
    QUERY = `SELECT 1=1 FROM users where email = '${mail}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}

module.exports = {checkuseridCracks, checkusernameCracks, checkmailCracks}