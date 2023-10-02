const {pool} = require("../db.js");


async function getObjects() {
    const [row] = await pool.query("select * from object");
    return row;
}

async function getObject(id) {
    if (!id) {
        throw new Error('Wrong object id');
    }
    const [row] = await pool.query("select * from object where object_id = ?", [id]);
    return row[0];
}

async function createObject(object) {
    const { name, activity, address } = object;
    const [row] = await pool.query(
        "INSERT INTO object(name, activity, address) VALUES (?, ?, ?)",
        [name, activity, address]
    );
    return row[0];
   
}

async function deleteObject(id) {
     if (!id) {
        throw new Error('Wrong object id');
    }
    const [row] = await pool.query('DELETE FROM object WHERE object_id = ?', [id]);
    return row[0];
}

async function updateObject(object, id) {
    if (!id) {
        throw new Error('Wrong object id');
    }
    const { name, activity, address } = object;
    const [row] = await pool.query("UPDATE object set name=?, activity=?, address=? where object_id=?", [name, activity, address, id]);
    return row[0];
}

module.exports = {
    getObjects,
    getObject,
    createObject,
    deleteObject,
    updateObject
}