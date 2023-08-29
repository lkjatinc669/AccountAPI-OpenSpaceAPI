const connection = require("../db/connection")
const generator = require("../extra/generators")
const printer = require("../extra/colorPrinter")

// Main Signup Function

// "id": resList[0],
// "fname": resList[1],
// "lname": resList[2],
// "email": resList[3],
// "username": resList[4],
// "profileurl": resList[5],
// "token": resList[6],
// "isverified": resList[7]

async function signupCracks(email, username, password) {
    var id = generator(20)
    var token = generator(30)
    const QUERY = `INSERT INTO users\
    (id, email, username, password, token, isVerified, verifyToken, isDisable)\
    VALUES ('${id}', '${email}', '${username}', '${password}', '${token}', '${0}', '${null}', '${0}')`;

    const dataSet = await connection.query(QUERY)
        .catch(error => printer.warning("Error "+ error));

    resList = [id, email, username, token];
    return await resList;
}

// Helper Signup Function

module.exports = signupCracks