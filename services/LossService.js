const {pool} = require("../db.js");


async function getLoss(id) {
    if (!id) {
        throw new Error('Wrong loss id');
    }
    const [row] = await pool.query("select * from losses where concentration_id = ?", [id]);
    return row[0];
}

async function getLossWithName(id) {
    if (!id) {
        throw new Error('Wrong loss id');
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


async function createLoss(loss) {
    const { concentration_id, mass, a, kt, kzi, z } = loss;
;
    const [row] = await pool.query("INSERT INTO losses(concentration_id, mass, a, kt, kzi, z) VALUES (?, ?, ?, ?, ?, ?)", [concentration_id, mass, a, kt, kzi]
    );
    return row.affectedRows;
}

async function updateLoss(loss, id) {
    if (!id) {
        throw new Error('Wrong loss id');
    }
    const { concentration_id, mass, a, kt, kzi, z } = loss;
    const [row] = await pool.query("UPDATE losses set concentration_id=?, mass=?, a=?, kt=?, kzi=?, z=? where concentration_id=?", [Number(concentration_id), mass, a, kt, kzi, z, id]);
    return row[0];
}

async function deleteLoss(id) {
     if (!id) {
        throw new Error('Wrong loss id');
    }
    const [row] = await pool.query('DELETE FROM losses WHERE concentration_id = ?', [id]);
    return row[0];
}

module.exports = {
    getLoss,
    getLossWithName,
    createLoss,
    updateLoss,
    deleteLoss
}