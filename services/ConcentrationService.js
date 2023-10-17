const {pool} = require("../db.js");


async function  getConcentrations() {
    const [row] = await pool.query("select * from pollutant_concentration");
    return row;
}

async function getConcentration(id) {
    if (!id) {
        throw new Error('Wrong concentration id');
    }
    const [row] = await pool.query("select * from pollutant_concentration where concentration_id = ?", [id]);
    return row[0];
}

async function getConcentrationWithName(id) {
    if (!id) {
        throw new Error('Wrong concentration id');
    }
    const [row] = await pool.query("SELECT c.concentration_id, o.name AS object_name, o.object_id, \
            pl.pollutant_code, \
            pl.pollutant_name, \
            c.concentration_value \
        FROM \
            pollutant_concentration c \
        JOIN \
            object o ON c.object_id = o.object_id \
        JOIN \
            pollutant pl ON c.pollutant_code = pl.pollutant_code \
        WHERE \
            c.concentration_id = ?", [id]);
    return row[0];
}

async function getConcentrationsWithName() {
    const [row] = await pool.query("SELECT concentration.concentration_id, object.name as object_name, \
        pollutant.pollutant_name, concentration.concentration_value \
        FROM pollutant_concentration as concentration \
        JOIN object ON concentration.object_id = object.object_id \
        JOIN pollutant ON concentration.pollutant_code = pollutant.pollutant_code");
    return row;
}

async function createConcentration(concentration) {
    const { object_id, pollutant_code, concentration_value } = concentration;
;
    const [row] = await pool.query("INSERT INTO pollutant_concentration(object_id, pollutant_code, concentration_value) VALUES (?, ?, ?)", [object_id, pollutant_code, concentration_value]
    );
    return row.affectedRows;
}
async function deleteConcentration(id) {
     if (!id) {
        throw new Error('Wrong concentration id');
    }
    const [row] = await pool.query('DELETE FROM pollutant_concentration WHERE concentration_id = ?', [id]);
    return row[0];
}

async function updateConcentration(concentration, id) {
    if (!id) {
        throw new Error('Wrong concentration id');
    }
    const { object_id, pollutant_code, concentration_value } = concentration;
    const [row] = await pool.query("UPDATE pollutant_concentration set object_id=?, pollutant_code=?, concentration_value=? where concentration_id=?", [Number(object_id), Number(pollutant_code), concentration_value, id]);
    return row[0];
}

module.exports = {
    getConcentration,
    getConcentrationWithName,
    getConcentrations,
    getConcentrationsWithName,
    createConcentration,
    deleteConcentration,
    updateConcentration
}