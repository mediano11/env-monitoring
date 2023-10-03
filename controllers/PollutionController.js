const PollutionService = require("../services/PollutionService.js");
const PollutantService = require("../services/PollutantService.js");
const ObjectService = require("../services/ObjectService.js");

async function getPollutions(req, res) {
    try {
        const pollutions = await PollutionService.getPollutionsWithName();
        res.render("pages/pollutions/pollutions", {
            pollutions,
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}
async function createPollution(req, res) {
    try {
        const newPollution = await PollutionService.createPollution(req.body);
        if (!newPollution) {
            throw new Error('Pollution not added!');
        }
        res.redirect("/pollutions");
    } catch (error) {
        res.render("pages/error", { error });
    }   
}
async function getCreatePollution(req, res) {
    res.render('pages/pollutions/add', {
        pollutants: await PollutantService.getPollutants(),
        objects: await ObjectService.getObjects(),
        pollutant_value: 0,
        date: 2023
    })
}


module.exports = {
    getPollutions,
    createPollution,
    getCreatePollution
}