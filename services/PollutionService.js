const {pool} = require("../db.js");


async function getPollutions() {
    const [row] = await pool.query("select * from pollution");
    return row;
}

async function getPollutionsWithName() {
    const [row] = await pool.query("SELECT pollution.pollution_id, object.name as object_name, \
        pollutant.pollutant_name, pollution.pollutant_value, pollution.date \
        FROM pollution \
        JOIN object ON pollution.object_id = object.object_id \
        JOIN pollutant ON pollution.pollutant_code = pollutant.pollutant_code");
    return row;
}

async function createPollution(pollution) {
    const { object_id, pollutant_code, pollutant_value, date } = pollution;
    const [row] = await pool.query("INSERT INTO pollution(object_id, pollutant_code, pollutant_value, date) VALUES (?, ?, ?, ?)", [object_id, pollutant_code, pollutant_value, date]
    );
    return row.affectedRows;
}

module.exports = {
    getPollutions,
    getPollutionsWithName,
    createPollution
}