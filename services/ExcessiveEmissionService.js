const {pool} = require("../db.js");


async function getExcessiveEmission(id) {
    if (!id) {
        throw new Error('Wrong excessive emissionid');
    }
    const [row] = await pool.query("select * from excessive_emission where concentration_id = ?", [id]);
    return row[0];
}

async function getExcessiveEmissionWithName(id) {
    if (!id) {
        throw new Error('Wrong excessive emissionid');
    }
    const [row] = await pool.query("SELECT o.name AS object_name, \
    p.pollutant_name, \
    l.concentration_id, \
    pc.concentration_value, \
    l.mass, l.a, l.kt, l.kzi, l.z \
    FROM \
        excessive_emission AS l \
    JOIN \
        pollutant_concentration AS pc ON l.concentration_id = pc.concentration_id  \
    JOIN \
        pollutant AS p ON pc.pollutant_code = p.pollutant_code \
    JOIN \
        object AS o ON pc.object_id = o.object_id \
    WHERE \
        l.concentration_id = ?", [id]);
    return row[0];
}


async function createExcessiveEmission(excessive_emission) {
    const { concentration_id, mass, a, kt, kzi, z } = excessive_emission;
;
    const [row] = await pool.query("INSERT INTO excessive_emission(concentration_id, mass, a, kt, kzi, z) VALUES (?, ?, ?, ?, ?, ?)", [concentration_id, mass, a, kt, kzi]
    );
    return row.affectedRows;
}

async function updateExcessiveEmission(excessive_emission, id) {
    if (!id) {
        throw new Error('Wrong excessive emissionid');
    }
    const { concentration_id, mass, a, kt, kzi, z } = excessive_emission;
    const [row] = await pool.query("UPDATE excessive_emission set concentration_id=?, mass=?, a=?, kt=?, kzi=?, z=? where concentration_id=?", [Number(concentration_id), mass, a, kt, kzi, z, id]);
    return row[0];
}

async function deleteExcessiveEmission(id) {
     if (!id) {
        throw new Error('Wrong excessive emissionid');
    }
    const [row] = await pool.query('DELETE FROM excessive_emission WHERE concentration_id = ?', [id]);
    return row[0];
}

module.exports = {
    getExcessiveEmission,
    getExcessiveEmissionWithName,
    createExcessiveEmission,
    updateExcessiveEmission,
    deleteExcessiveEmission
}