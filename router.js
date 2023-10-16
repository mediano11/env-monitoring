const express = require('express');
const router = express.Router();

const ObjectController = require("./controllers/ObjectController.js");
const PollutantController = require("./controllers/PollutantController.js");
const PollutionController = require("./controllers/PollutionController.js");
const ConcentrationController = require("./controllers/ConcentrationController.js");
const UploadController = require("./controllers/UploadController.js");

//index
router.get('/', (req, res) => {
    res.render("pages/index");
})

//objects
router.post('/objects/add', ObjectController.createObject);
router.get('/objects/add', (req, res) => {
    res.render('pages/objects/add', {
        name: '',
        activity: '',
        address:''
    })
});
router.get('/objects', ObjectController.getObjects);
router.get('/objects/delete/:id', ObjectController.deleteObject);
router.post('/objects/update/:id', ObjectController.updateObject);
router.get('/objects/edit/:id', ObjectController.getObject);


//pollutants
router.post('/pollutants/add', PollutantController.createPollutant);
router.get('/pollutants/add', (req, res) => {
    res.render('pages/pollutants/add', {
        pollutant_name: '',
        gdk: 0
    })
});
router.get('/pollutants', PollutantController.getPollutants);
router.get('/pollutants/delete/:id', PollutantController.deletePollutant);
router.post('/pollutants/update/:id', PollutantController.updatePollutant);
router.get('/pollutants/edit/:id', PollutantController.getPollutant);


//pollutions
router.get('/pollutions', PollutionController.getPollutions);
router.post('/pollutions/add', PollutionController.createPollution);
router.get('/pollutions/add', PollutionController.getCreatePollution);
router.get('/pollutions/delete/:id', PollutionController.deletePollution);
router.post('/pollutions/update/:id', PollutionController.updatePollution);
router.get('/pollutions/edit/:id', PollutionController.getPollution);


//concentrations
router.get('/concentrations', ConcentrationController.getConcentrations);
router.post('/concentrations/add', ConcentrationController.createConcentration);
router.get('/concentrations/add', ConcentrationController.getCreateConcentration);
router.get('/concentrations/delete/:id', ConcentrationController.deleteConcentration);
router.post('/concentrations/update/:id', ConcentrationController.updateConcentration);
router.get('/concentrations/edit/:id', ConcentrationController.getConcentration);

router.get('/concentrations/calculate_risk/:id', ConcentrationController.getCalculateRisk);
router.post('/concentrations/calculate_risk/:id', ConcentrationController.postCalculateRisk);

//upload
router.get("/upload",UploadController.uploadExcel)
router.post("/excel-data", UploadController.upload.single('importexcel'), UploadController.excelData);

module.exports = router;