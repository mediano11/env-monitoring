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

async function deleteObject(req, res) {
    if (isNaN(+req.params.id)) {
        return res.redirect("/objects");
    }
    let id = req.params.id;
    try {
        await pool.query('DELETE FROM object WHERE object_id = ?', [id]);
        res.redirect("/objects");
    } catch (error) {
        res.render("pages/error", { error });
    }   
}

module.exports = {
    getObjects,
    createObject,
    deleteObject
}