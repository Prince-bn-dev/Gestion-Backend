const Paiement = require('../models/Paiement');
const Reservation = require('../models/Reservation');

exports.createPaiement = async (req, res) => {
  const { reservation, montant, kkiapay_id, statut } = req.body;

  try {
    const existingReservation = await Reservation.findById(reservation);
    if (!existingReservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    const newPaiement = new Paiement({
      reservation,
      montant,
      kkiapay_id,
      statut
    });


    const savedPaiement = await newPaiement.save();

    existingReservation.paiement = savedPaiement._id;
    await existingReservation.save();

    res.status(201).json(savedPaiement);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Ce kkiapay_id existe déjà.' });
    }
    res.status(400).json({ error: error.message });
  }
};


exports.getPaiements = async (req, res) => {
  try {
    const paiements = await Paiement.find()
      .populate('reservation');
    res.status(200).json(paiements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaiementById = async (req, res) => {
  try {
    const paiement = await Paiement.findById(req.params.id)
      .populate('reservation');
    if (!paiement) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }
    res.status(200).json(paiement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updatePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!paiement) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }
    res.status(200).json(paiement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByIdAndDelete(req.params.id);
    if (!paiement) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }
    res.status(200).json({ message: 'Paiement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
