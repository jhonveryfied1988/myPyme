const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/resumen', dashboardController.getResumen);
router.get('/indicadores', dashboardController.getIndicadores);

module.exports = router;