const express = require('express');
const router = express.Router();
const { getObjects } = require("./controllers/ObjectController.js");


router.get('/', (req, res) => {
    res.render("pages/index");
})
router.post('/objects');
router.get('/objects', getObjects);

module.exports = router;