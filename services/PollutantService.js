const {pool} = require("../db.js");


async function getPollutants() {
    const [row] = await pool.query("select * from pollutant");
    return row;
}

async function getPollutant(id) {
    if (!id) {
        throw new Error('Wrong pollutant id');
    }
    const [row] = await pool.query("select * from pollutant where pollutant_code = ?", [id]);
    return row[0];
}

async function createPollutant(pollutant) {
    const { pollutant_name, gdk } = pollutant;
    const [row] = await pool.query(
        "INSERT INTO pollutant(pollutant_name, gdk) VALUES (?, ?)",
        [pollutant_name, gdk]
    );
    return row[0];
   
}

async function deletePollutant(id) {
     if (!id) {
        throw new Error('Wrong pollutant id');
    }
    const [row] = await pool.query('DELETE FROM pollutant WHERE pollutant_code = ?', [id]);
    return row[0];
}

async function updatePollutant(pollutant, id) {
    if (!id) {
        throw new Error('Wrong pollutant id');
    }
    const { pollutant_name, gdk } = pollutant;
    const [row] = await pool.query("UPDATE pollutant set pollutant_name=?, gdk=? where pollutant_code=?", [pollutant_name, gdk, id]);
    return row[0];
}

module.exports = {
    createPollutant,
    deletePollutant,
    updatePollutant,
    getPollutant,
    getPollutants
}