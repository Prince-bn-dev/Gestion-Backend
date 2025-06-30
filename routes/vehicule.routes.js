const express = require('express');
const router = express.Router();
const vehiculeController = require('../controllers/vehicule.controller');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});
const upload = multer({ storage });

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




router.post('/:vehiculeId/images', upload.single('image'), vehiculeController.uploadVehiculeImage);


module.exports = router;
