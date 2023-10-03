const multer = require('multer');
const reader = require('xlsx');
const { pool } = require('../db.js');
// const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({ 
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({storage});
    
const ObjectService = require("../services/ObjectService.js");
const PollutantService = require("../services/PollutantService.js");
const PollutionService = require("../services/PollutionService.js");


async function uploadExcel(req, res){
    res.render("pages/upload");
}   

async function excelData (req, res) {
    if (!req.file) {
        res.render("pages/error", {
            error: {
                message: 'Please, choose a file!'
            }
        })
        return;
    }
    const file = reader.readFile(req.file.destination + req.file.filename);
    let objects = [];
    let pollutants = [];
    let pollutions = [];

    const tabs = file.SheetNames;
    for (const tab of tabs) {
        const temp = reader.utils.sheet_to_json(file.Sheets[tab]);
        switch (tab) {
            case 'object':
                objects.push(...temp);
                break;
            case 'pollutant':
                pollutants.push(...temp);
                break;
            case 'pollution':
                pollutions.push(...temp);
                break;
            default:
                break;
        }
    }

    try {
        for (const object of objects) {
            try {
                const newObject = await ObjectService.createObject(object);
            } catch (error) {
                if (error.errno === 1062) {
                    console.error(`Object ${object.name} already added.`);
                    continue;
                }  
            }
        }
        for (const pollutant of pollutants) {     
            try {
                const newPollutant = await PollutantService.createPollutant(pollutant);
            } catch (error) {
                if (error.errno === 1062) {
                    console.error(`Pollutant ${pollutant.pollutant_name} already added.`);
                    continue;
                }
            }
        }
        for (const pollution of pollutions) {
            const { object_name, pollutant_name, pollutant_value, date } = pollution;
            const pollutant_code = await PollutantService.getPollutantId(pollutant_name);

            if (pollutant_code === null) {
                console.error(`Pollutant not found: ${pollutant_name}`);
                continue;
            }

            const object_id = await ObjectService.getObjectId(object_name);
            if (object_id === null) {
                console.error(`Object not found: ${object_name}`);
                continue;
            }

            const newPollution = await PollutionService.createPollution({ object_id, pollutant_code, pollutant_value, date });
        }
        res.redirect("/objects");
        
    } catch (error) {
        if (error.erno === 1062) {
            return;
        }
        res.render("pages/error", { error });
    }
};

module.exports = {
    uploadExcel,
    excelData,
    upload
}