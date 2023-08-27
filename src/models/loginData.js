const connection = require("../db/connection")

async function loginCracks(type, data, password) {
    resultSet = []

    // Building Query
    var QUERY = "SELECT * FROM users WHERE"
    if (type=="em") { QUERY += ` email='${data}'`}
    else if (type=="un") { QUERY += ` username='${data}'`}
    else if (type=="tk") { QUERY += ` token='${data}'`}
    QUERY += ` AND password='${password}'`

    const dataSet = await connection.query(QUERY)
        .catch(error => console.log(error));

    return await {
        "id" : dataSet[0][0].id,
        "email": dataSet[0][0].email,
        "username": dataSet[0][0].username,
        "token": dataSet[0][0].token,
        "isVerified": dataSet[0][0].isVerified,
        "isDisable": dataSet[0][0].isDisable
    };
}

async function login(type, data, token, password) {
    var QUERY = "SELECT * FROM users WHERE"
    if (type=="em") { QUERY += ` email='${data}'`}
    else if (type=="un") { QUERY += ` username='${data}'`}
    else if (type=="tk") { QUERY += ` oldtoken='${data}'`}
    QUERY += ` AND password='${password}'`

    const [dataSet] = await connection.query(QUERY)
        .catch(error => console.log(error));

    console.log(dataSet)
}

const cid = "000";
const cemail = "bbb";
const cusername = "bbb";
const cpassword = "dfd";
const coldtoken = "ffdsa";
(async ()=>{
    aa = await login("em", cemail, coldtoken, cpassword)
    console.log(aa)
})();


module.exports = loginCracks