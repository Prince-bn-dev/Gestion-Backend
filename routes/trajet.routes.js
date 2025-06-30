const express = require('express');
const router = express.Router();
const trajetCtrl = require('../controllers/trajet.controller');


router.post('/', trajetCtrl.createTrajet);
router.get('/', trajetCtrl.getAllTrajets);
router.get('/:id', trajetCtrl.getTrajetById);
router.put('/:id', trajetCtrl.updateTrajet);
router.delete('/:id', trajetCtrl.deleteTrajet);

module.exports = router;
