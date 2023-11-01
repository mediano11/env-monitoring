const PollutantService = require("../services/PollutantService.js");

async function getPollutants(req, res) {
    const filters = req.query
    try {
        const pollutants = await PollutantService.getPollutants();
        const filteredPollutant = pollutants.filter(pollutant => { 
            let isValid = true; 
            for (key in filters) {
                if (filters[key]) {
                    isValid = isValid && pollutant[key].toLocaleLowerCase().includes(filters[key].toLocaleLowerCase()); 
                }
            }
            return isValid; 
        }); 
        res.render("pages/pollutants/pollutants", {
            pollutants: filteredPollutant,
            query: filters
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getPollutant(req, res) {
    const { id } = req.params;
    try {
        const pollutant = await PollutantService.getPollutant(id);
        res.render("pages/pollutants/edit", { pollutant });
    } catch (error) {
        res.render("pages/error", { error });
    }
}
async function getCreatePollutant(req, res) {
    res.render('pages/pollutants/add', {
        pollutant_name: '',
        gdk: 0,
        danger_class: 0,
        tax_rate: 0
    })
}
async function createPollutant(req, res) {
    try {
        const newPollutant = await PollutantService.createPollutant(req.body)
        res.redirect("/pollutants");
    } catch (error) {
        res.render("pages/error", { error });
    }   
}

async function deletePollutant(req, res) {
    const { id } = req.params;
    try {
        const pollutant = await PollutantService.deletePollutant(id);
        res.redirect("/pollutants");
    } catch (error) {
        res.render("pages/error", { error });
    }   
}

async function updatePollutant(req, res) {
    const { id } = req.params;
    try {
        const updatedPollutant = await PollutantService.updatePollutant(req.body, id);
        res.redirect("/pollutants");
    } catch (error) {
        res.render("pages/error", { error });
    }   
}

module.exports = {
    getPollutants,
    getPollutant,
    getCreatePollutant,
    createPollutant,
    deletePollutant,
    updatePollutant
}