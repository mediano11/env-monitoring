const mysql = require("mysql2/promise");

const config = {
    db: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DB
    }
}

const pool = mysql.createPool(config.db);

module.exports = {
  pool
}