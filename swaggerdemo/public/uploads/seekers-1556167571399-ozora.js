var express = require('express');
var router = express.Router();
var controller = require('../Controller/seekersControll');
/* GET users listing. */
router.post('/add',controller.addUser);
router.post('/addfile',controller.addFile);
router.post('/login',controller.loginUser);

module.exports = router;
