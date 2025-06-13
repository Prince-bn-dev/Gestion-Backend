const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiement.controller');
const {protect , authorizeRoles} = require('../middlewares/authMiddleware')


router.post('/',protect , authorizeRoles('voyageur') , paiementController.createPaiement);
router.get('/',protect , authorizeRoles('gestionnaire') , paiementController.getPaiements);
router.get('/:id',protect , authorizeRoles('voyageur') , paiementController.getPaiementById);
router.put('/:id',protect , authorizeRoles('voyageur') , paiementController.updatePaiement);
router.delete('/:id',protect , authorizeRoles('voyageur') , paiementController.deletePaiement);

module.exports = router;
