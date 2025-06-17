const express = require('express');
const router = express.Router();
const voyageController = require('../controllers/voyage.controller');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');


router.post('/',protect,authorizeRoles('gestionnaire'), voyageController.createVoyage);
router.get('/', voyageController.getAllVoyages);
router.get('/:id', protect,authorizeRoles('gestionnaire'),voyageController.getVoyageById);
router.put('/:id',protect,authorizeRoles('gestionnaire'), voyageController.updateVoyage);
router.delete('/:id',protect,authorizeRoles('gestionnaire'), voyageController.deleteVoyage);
router.get('/gestionnaire/:gestionnaireId', protect,authorizeRoles('gestionnaire'),voyageController.getVoyagesByGestionnaire);
router.get('/chauffeur/:chauffeurId', voyageController.getVoyagesByChauffeurVehicule);

module.exports = router;
