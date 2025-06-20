const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const {protect , authorizeRoles} = require('../middlewares/authMiddleware')


router.post('/',reservationController.createReservation);
router.get('/',protect , authorizeRoles('gestionnaire', 'admin'), reservationController.getReservations);
router.get('/:id', reservationController.getReservationById);
router.put('/:id',protect , reservationController.updateReservation);
router.get('/voyageur/:voyageurId', protect, authorizeRoles('voyageur'), reservationController.getReservationByVoyageur);
router.delete('/:id',protect , authorizeRoles('voyageur'), reservationController.deleteReservation);

module.exports = router;
