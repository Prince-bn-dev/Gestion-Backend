const express = require('express');
const router = express.Router();
const vehiculeController = require('../controllers/vehicule.controller');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware')

router.post('/',protect,authorizeRoles('gestionnaire') , vehiculeController.createVehicule);
router.get('/', vehiculeController.getAllVehicules);
router.get('/:id',protect,authorizeRoles('gestionnaire') , vehiculeController.getVehiculeById);
router.put('/:id',protect,authorizeRoles('gestionnaire') , vehiculeController.updateVehicule);
router.put('/chauffeur/:id' ,protect,authorizeRoles('gestionnaire') ,vehiculeController.addChauffeurByVehicule )
router.get('/parc/:id',protect,authorizeRoles('gestionnaire') , vehiculeController.getVehiculesByParc);
router.get('/chauffeur/:id',protect,authorizeRoles('chauffeur') , vehiculeController.getVehiculesByChauffeur);
router.get('/gestionnaire/:id',protect,authorizeRoles('gestionnaire') , vehiculeController.getVehiculesByGestionnaire);
router.delete('/:id', vehiculeController.deleteVehicule);
router.put('/:id/gps', vehiculeController.updateGPS);




router.post('/:vehiculeId/images', upload ,  vehiculeController.uploadVehiculeImage);
router.delete(
  "/vehicules/:vehiculeId/images/:imageId",
  vehiculeController.deleteVehiculeImage
);


module.exports = router;
