   const ObjectService = require("../services/ObjectService.js");

async function getObjects(req, res) {
    const filters = req.query; 
    try {
        const objects = await ObjectService.getObjects();
        const filteredObjects = objects.filter(object => { 
            let isValid = true; 
            for (key in filters) {
                if (filters[key]) {
                    isValid = isValid && object[key].toLocaleLowerCase().includes(filters[key].toLocaleLowerCase()); 
                }
            }
            return isValid; 
        }); 
        res.render("pages/objects/objects", {
            objects: filteredObjects,
            query: filters
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getObject(req, res) {
    const { id } = req.params;
    try {
        const object = await ObjectService.getObject(id);
        res.render("pages/objects/edit", { object });
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