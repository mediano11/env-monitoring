const {pool} = require("../db.js");


async function getPollutions() {
    const [row] = await pool.query("select * from pollution");
    return row;
}

async function getPollution(id) {
    if (!id) {
        throw new Error('Wrong pollution id');
    }
    const [row] = await pool.query("select * from pollution where pollution_id = ?", [id]);
    return row[0];
}

async function getPollutionWithName(id) {
    if (!id) {
        throw new Error('Wrong pollution id');
    }
    const [row] = await pool.query("SELECT p.pollution_id, o.name AS object_name, o.object_id, \
            pl.pollutant_code, \
            pl.pollutant_name, \
            p.pollutant_value, \
            p.date \
        FROM \
            pollution p \
        JOIN \
            object o ON p.object_id = o.object_id \
        JOIN \
            pollutant pl ON p.pollutant_code = pl.pollutant_code \
        WHERE \
            p.pollution_id = ?", [id]);
    return row[0];
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
async function deletePollution(id) {
     if (!id) {
        throw new Error('Wrong pollution id');
    }
    const [row] = await pool.query('DELETE FROM pollution WHERE pollution_id = ?', [id]);
    return row[0];
}

async function updatePollution(pollution, id) {
    if (!id) {
        throw new Error('Wrong pollution id');
    }
    const { object_id, pollutant_code, pollutant_value, date } = pollution;
    const [row] = await pool.query("UPDATE pollution set object_id=?, pollutant_code=?, pollutant_value=?, date=? where pollution_id=?", [Number(object_id), Number(pollutant_code), pollutant_value, date, id]);
    return row[0];
}

module.exports = {
    getPollutions,
    getPollutionsWithName,
    createPollution,
    deletePollution,
    updatePollution,
    getPollution,
    getPollutionWithName
}