const connection = require("../db/connection")
const generator = require("../extra/generators")
const printer = require("../extra/colorPrinter")
const checkers = require("./checkData")
const userTable = process.env.USERSTABLE;

async function updateusernameCracks(userid, token, password, newusername) {
    const yy = await checkBase(userid, token, password)
    if (yy == 0){
        return [false, "ERROR_USER_VERIFICATION", "Provide valid userid, token & password", null]
    } else {
        const yyy = await updateUsername(userid, newusername)
        if (yyy == 1){
            return [true, "NO_ERROR", null, null]
        } else {
            return [false, "PASSWORD_VERIFIED_USERNAME_UPDATE_ERROR", "Failed to update username", null]
        }
    }
}

async function checkBase(userid, token, password) {
    const QUERY = `SELECT * FROM ${userTable} WHERE 
    osa_userUnqID='${userid}' AND
    osa_newToken = '${token}' AND
    osa_passWord = '${password}'`;

    const [dataSet] = await connection.query(QUERY)
        .catch(error => printer.warning("Error "+ error));

    return dataSet.length;
}

async function updateUsername(userid, newusername) {
    QUERY = `UPDATE ${userTable} 
    SET osa_userName='${newusername}'
    WHERE osa_userunqid='${userid}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    return await yy['affectedRows']
}

const fileUpload = require('express-fileupload');
// app.use(fileUpload());

async function updateProfile(userid, filename){
    QUERY = `UPDATE ${userTable} 
    SET osa_pPicURL = '${filename}'
    WHERE osa_userUnqID='${userid}'`
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    return await yy['affectedRows']
}

async function checkProfileExists(filename){
    QUERY = `SELECT 1=1 FROM ${userTable} 
    where 
    osa_pPicURL = '${filename}'`;
    const [yy] = await connection.query(QUERY)
        .catch(error => printer.warning("[ERROR] : "+error))
    if (yy.length == 0) { return false } else { return true }
}


module.exports = { updateusernameCracks, updateProfile, checkProfileExists }