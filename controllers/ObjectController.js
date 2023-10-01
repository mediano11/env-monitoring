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


module.exports = {
  getObjects
}