const {pool} = require("../db.js");


async function getRisk(id) {
    if (!id) {
        throw new Error('Wrong risk id');
    }
    const [row] = await pool.query("select * from risks where    = ?", [id]);
    return row[0];
}

async function getRiskWithName(id) {
    if (!id) {
        throw new Error('Wrong risk id');
    }
    const [row] = await pool.query("SELECT o.name AS object_name, \
    p.pollutant_name, \
    r.concentration_id, \
    pc.concentration_value, \
    r.add_ladd, r.cr, r.pcr, r.hq \
    FROM \
        risks AS r \
    JOIN \
        pollutant_concentration AS pc ON r.concentration_id = pc.concentration_id  \
    JOIN \
        pollutant AS p ON pc.pollutant_code = p.pollutant_code \
    JOIN \
        object AS o ON pc.object_id = o.object_id \
    WHERE \
        r.concentration_id = ?", [id]);
    return row[0];
}


async function createRisk(risk) {
    const { concentration_id, add_ladd, cr, pcr, hq } = risk;
;
    const [row] = await pool.query("INSERT INTO risks(concentration_id, add_ladd, cr, pcr, hq) VALUES (?, ?, ?, ?, ?)", [concentration_id, add_ladd, cr, pcr, hq]
    );
    return row.affectedRows;
}

async function updateRisk(risk, id) {
    if (!id) {
        throw new Error('Wrong risk id');
    }
    const { concentration_id, add_ladd, cr, pcr, hq } = risk;
    const [row] = await pool.query("UPDATE risks set concentration_id=?, add_ladd=?, cr=?, pcr=?, hq=? where concentration_id=?", [Number(concentration_id), add_ladd, cr, pcr, hq, id]);
    return row[0];
}

async function deleteRisk(id) {
     if (!id) {
        throw new Error('Wrong risk id');
    }
    const [row] = await pool.query('DELETE FROM risks WHERE concentration_id = ?', [id]);
    return row[0];
}

module.exports = {
    getRisk,
    getRiskWithName,
    createRisk,
    updateRisk,
    deleteRisk
}