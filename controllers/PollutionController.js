const PollutionService = require("../services/PollutionService.js");

async function getPollutions(req, res) {
    try {
        const pollutions = await PollutionService.getPollutions();
        res.render("pages/pollutions/pollutions", {
            pollutions,
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}


module.exports = {
    getPollutions
}