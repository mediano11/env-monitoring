const ConcentrationService = require("../services/ConcentrationService.js");
const EmergenceService = require("../services/EmergenceService.js");
const formatter = Intl.NumberFormat('en');

async function getEmergencies(req, res) {
    const { id } = req.params;
    try {
        const concentration = await ConcentrationService.getConcentrationWithName(id);
        res.render(`pages/emergencies/emergencies`, {
            ...concentration,
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}



module.exports = {
    getEmergencies,
}