const express = require("express");
require('dotenv').config();
const mysql = require('mysql2');

const PORT = 5000;
const app = express();
app.set("view engine", "ejs");
app.use(express.json());    

const pool = mysql.createPool({
  host     : process.env.HOST,
  user     : process.env.USER,
  password : process.env.PASSWORD,
  database : process.env.DB
}).promise();

const getObjects = async () => {
    try {
        const [rows] = await pool.query("select * frowm object");
        return rows;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

app.get("/", async (req, res,) => {
    try {
        const objects = await getObjects();
        res.render("pages/index", {
            objects
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
        
});

const startApp = async () => {
    try {
        app.listen(PORT, () => console.log('server started on port: ', PORT));
    } catch (error) {
        res.render("pages/error", { error });
    }
}

startApp()