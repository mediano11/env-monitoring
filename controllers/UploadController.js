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
            const newObject = await ObjectService.createObject(object);
        }
        for (const pollutant of pollutants) {
            const newPollutant = await PollutantService.createPollutant(pollutant);
        }
        for (const pollution of pollutions) {
            const { object_id, pollutant_code, pollutant_value, date } = pollution;
            const newPollution = await pool.query("INSERT INTO pollution(object_id, pollutant_code, pollutant_value, date) VALUES (?, ?, ?, ?)", [object_id, pollutant_code, pollutant_value, date]
            );
        }
        res.redirect("/objects");
        
    } catch (error) {
        res.render("pages/error", { error });
    }
};

module.exports = {
    uploadExcel,
    excelData,
    upload
}