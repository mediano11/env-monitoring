const express = require('express');
const router = express.Router();
const ObjectController = require("./controllers/ObjectController.js");


router.get('/', (req, res) => {
    res.render("pages/index");
})
router.post('/objects/add', ObjectController.createObject);
router.get('/objects/add', (req, res) => {
    res.render('pages/add', {
        name: '',
        activity: '',
        address:''
    })
});
router.get('/objects', ObjectController.getObjects);
router.get('/objects/delete/:id', ObjectController.deleteObject);

module.exports = router;