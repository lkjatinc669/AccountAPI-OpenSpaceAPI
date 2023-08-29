require("dotenv").config()
var mysql = require('mysql2/promise');

const con = mysql.createPool({
  host: process.env.SERVERHOST,
  user: process.env.SERVERUSERNAME,
  password: process.env.SERVERUSERPASSWORD,
  database: process.env.SERVERDBNAME
  // database: "worlds"
});


// con.query("SELECT 1=1")
//   .then(data=>{
//     if (data[0][0]['1=1'] == 1){
//       console.log("From Cnnection.js : DataBase Successfully Connected")
//     }
//   })
//   .catch(err => console.log("DB Connection Failed\n"+err));

module.exports = con