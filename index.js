const express = require("express");
require('dotenv').config();
const mysql = require('mysql2');

const PORT = 5000;
const app = express();
app.use(express.json())

const connection = mysql.createConnection({
  host     : process.env.HOST,
  user     : process.env.USER,
  password : process.env.PASSWORD,
  database : process.env.DB
}).promise();

;
app.post("/", (req, res) => {
    res.status(200).json("server works")
});

const startApp = async () => {
    try {
        const result = await connection.query("select * from object");
        app.listen(PORT, () => console.log('server started on port: ', PORT));
        console.log(result)
    } catch (error) {
        console.log(error);
    }
}

startApp()