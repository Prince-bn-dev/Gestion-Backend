const express = require('express');
const router = express.Router();
const parcController = require('../controllers/parc.controller');
const {protect , authorizeRoles} = require('../middlewares/authMiddleware');


router.post('/',protect , authorizeRoles("gestionnaire") , parcController.createParc);
router.get('/',protect , authorizeRoles("admin") , parcController.getParcs);
router.get('/gestionnaire/:id',protect , authorizeRoles("gestionnaire") , parcController.getParcsByGestionnaire);
router.get('/:id',protect , authorizeRoles("gestionnaire") , parcController.getParcById);
router.put('/:id',protect , authorizeRoles("gestionnaire") , parcController.updateParc);

module.exports = router;
