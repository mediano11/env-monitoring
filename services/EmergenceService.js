const {pool} = require("../db.js");

async function getEmergencyWithName(id) {
    if (!id) {
        throw new Error('Wrong emergency id');
    }
    const [row] = await pool.query("SELECT o.name AS object_name, \
    p.pollutant_name, \
    l.concentration_id, \
    pc.concentration_value, \
    l.mass, l.a, l.kt, l.kzi, l.z \
    FROM \
        losses AS l \
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

module.exports = {
    getEmergencyWithName,
}