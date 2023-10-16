const PollutantService = require("../services/PollutantService.js");
const ObjectService = require("../services/ObjectService.js");
const ConcentrationService = require("../services/ConcentrationService.js");

async function getConcentrations(req, res) {
    try {
        const concentrations = await ConcentrationService.getConcentrationsWithName();
        res.render("pages/concentrations/concentrations", {
            concentrations,
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getConcentration(req, res) {
    const { id } = req.params;
    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id);
        const pollutants = await PollutantService.getPollutants();
        const objects = await ObjectService.getObjects();
        res.render("pages/concentrations/edit", {
            concentration,
            pollutants,
            objects      
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function createConcentration(req, res) {
    try {
        const newConcentration = await ConcentrationService.createConcentration(req.body);
        if (!newConcentration) {
            throw new Error('Concentration not added!');
        }
        res.redirect("/concentrations");
    } catch (error) {
        res.render("pages/error", { error });
    }   
}
async function getCreateConcentration(req, res) {
    res.render('pages/concentrations/add', {
        pollutants: await PollutantService.getPollutants(),
        objects: await ObjectService.getObjects(),
        concentration_value: 0
    })
}

async function deleteConcentration(req, res) {
    const { id } = req.params;
    try {
        const concentration = await ConcentrationService.deleteConcentration(id);
        res.redirect("/concentrations");
    } catch (error) {
        res.render("pages/error", { error });
    }   
}

async function updateConcentration(req, res) {
    const { id } = req.params;
    try {
        const updatedConcentration = await ConcentrationService.updateConcentration(req.body, id);
        res.redirect("/concentrations");
    } catch (error) {
        res.render("pages/error", { error });
    }   
}


module.exports = {
    getConcentration,
    getConcentrations,
    getCreateConcentration,
    createConcentration,
    deleteConcentration,
    updateConcentration
}