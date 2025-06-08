const express = require('express');
const router = express.Router();
const bodegaController = require('../controllers/bodegaController');

router.get('/data', bodegaController.getData);

module.exports = router; 