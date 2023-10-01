const {pool} = require("../db.js");


async function getObjects(req, res) {
    try {
        const [row] = await  pool.query("select * from object");
        res.render("pages/objects", {
            objects: row,
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function createObject(req, res) {
    const { name, activity, address } = req.body;
    try {
        await pool.query(
            "INSERT INTO object(name, activity, address) VALUES (?, ?, ?)",
            [name, activity, address]
        );
        res.redirect("/objects");
    } catch (error) {
        res.render("pages/error", { error });
    }   
}

module.exports = {
    getObjects,
    createObject
}