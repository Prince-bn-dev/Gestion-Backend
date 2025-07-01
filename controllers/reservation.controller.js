const Reservation = require('../models/Reservation');


exports.createReservation = async (req, res) => {
  const { voyage, voyageur, nombre_places, paiement } = req.body;
  try {
    const newReservation = new Reservation({
      voyage,
      voyageur,
      nombre_places,
      paiement,
      statut: 'en_attente', 
    });
    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('voyage', 'lieu_depart lieu_arrivee date_depart')
      .populate('voyageur', 'nom email')
      .populate('paiement');
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    } 
    res.status(200).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  } 

};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('voyage')
      .populate('voyageur', 'nom email')
      .populate('paiement');
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json({ message: 'Réservation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReservationByVoyageur = async (req, res) => {
  try {
    const reservations = await Reservation.find({ voyageur: req.params.voyageurId })
      .populate({
        path: 'voyage',
        populate: {
          path: 'vehicule',
          populate: {
            path: 'parc'
          }
        },
         populate: {
          path: 'trajet',
        }
      })
      .populate('voyageur', 'nom  prenom email')
      .populate('paiement');

    if (reservations.length === 0) {
      return res.status(404).json({ message: 'Aucune réservation trouvée pour ce voyageur' });
    }

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


