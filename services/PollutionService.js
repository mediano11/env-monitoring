const {pool} = require("../db.js");


async function getPollutions() {
    const [row] = await pool.query("select * from pollution");
    return row;
}

module.exports = {
    getPollutions
}