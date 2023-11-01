const PollutionService = require("../services/PollutionService.js");
const PollutantService = require("../services/PollutantService.js");
const ObjectService = require("../services/ObjectService.js");

const formatter = Intl.NumberFormat('en');

function getClassTax(level) {
  const taxRates = {
    1: 18413.24,
    2: 4216.92,
    3: 628.32,
    4: 145.50,
  };
  return taxRates[level] || 0;
}

async function getPollutions(req, res) {
    try {      
        const pollutions = await PollutionService.getPollutionsWithName();
        const filters = req.query; 
        
        const result = await Promise.all(pollutions.map(async (pollution) => {
            const pollutant = await PollutantService.getPollutantByName(pollution.pollutant_name);
            const tax_value =
                pollutant.tax_rate ? pollutant.tax_rate :
                pollutant.danger_class ? getClassTax(pollutant.danger_class) : 0;
            
            const tax_amount = formatter.format(pollution.pollutant_value * tax_value);
 
            return {
                ...pollution,
                tax_value,
                tax_amount
            };
        }));
        
        const filteredResult = result.filter(pollution => { 
            let isValid = true; 
            for (key in filters) {
                if (filters[key]) {
                    isValid = isValid && (pollution[key] + '').toLocaleLowerCase().includes(filters[key].toLocaleLowerCase())  ;  
                }
            } 
            return isValid; 
        }); 
        res.render("pages/pollutions/pollutions", {
            pollutions: filteredResult,
            query: filters
        });
    } catch (error) {
        res.render("pages/error", { error });
    }
}

async function getPollution(req, res) {
    const { id } = req.params;
    try {
        const pollution = await PollutionService.getPollutionWithName(id);
        const pollutants = await PollutantService.getPollutants();
        const objects = await ObjectService.getObjects();
        res.render("pages/pollutions/edit", {
            pollution,
            pollutants,
            objects      
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

async function deletePollution(req, res) {
    const { id } = req.params;
    try {
        const pollution = await PollutionService.deletePollution(id);
        res.redirect("/pollutions");
    } catch (error) {
        res.render("pages/error", { error });
    }   
}

async function updatePollution(req, res) {
    const { id } = req.params;
    try {
        const updatedPollution = await PollutionService.updatePollution(req.body, id);
        res.redirect("/pollutions");
    } catch (error) {
        res.render("pages/error", { error });
    }   
}


module.exports = {
    getPollutions,
    createPollution,
    getCreatePollution,
    deletePollution,
    updatePollution,
    getPollution
}