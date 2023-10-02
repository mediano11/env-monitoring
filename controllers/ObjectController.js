const {pool} = require("../db.js");
const ObjectService = require("../services/ObjectService.js");

async function getObjects(req, res) {
    try {
        const objects = await ObjectService.getObjects();
        res.render("pages/objects", {
            objects,
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getObject(req, res) {
    const { id } = req.params;
    try {
        const object = await ObjectService.getObject(id);
        res.render("pages/edit", { object });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function createObject(req, res) {
    try {
        const newObject = await ObjectService.createObject(req.body)
        res.redirect("/objects");
    } catch (error) {
        res.render("pages/error", { error });
    }   
}

async function deleteObject(req, res) {
    const { id } = req.params;
    try {
        const object = await ObjectService.deleteObject(id);
        res.redirect("/objects");
    } catch (error) {
        res.render("pages/error", { error });
    }   
}

async function updateObject(req, res) {
    const { id } = req.params;
    try {
        const updatedObject = await ObjectService.updateObject(req.body, id);
        res.redirect("/objects");
    } catch (error) {
        res.render("pages/error", { error });
    }   
}

module.exports = {
    getObjects,
    getObject,
    createObject,
    deleteObject,
    updateObject
}