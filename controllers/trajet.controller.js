const Trajet = require('../models/Trajet');

exports.createTrajet = async (req, res) => {
  try {
    const { lieux_depart, lieux_arrive } = req.body;
    const trajet = await Trajet.create({ lieux_depart, lieux_arrive });
    res.status(201).json(trajet);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création', error: err.message });
  }
};


exports.getAllTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.find().sort({ createdAt: -1 });
    res.status(200).json(trajets);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du chargement', error: err.message });
  }
};


exports.getTrajetById = async (req, res) => {
  try {
    const trajet = await Trajet.findById(req.params.id);
    if (!trajet) return res.status(404).json({ message: 'Trajet introuvable' });
    res.status(200).json(trajet);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du chargement', error: err.message });
  }
};

exports.updateTrajet = async (req, res) => {
  try {
    const { lieux_depart, lieux_arrive } = req.body;
    const trajet = await Trajet.findByIdAndUpdate(
      req.params.id,
      { lieux_depart, lieux_arrive },
      { new: true }
    );
    if (!trajet) return res.status(404).json({ message: 'Trajet introuvable' });
    res.status(200).json(trajet);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err.message });
  }
};


exports.deleteTrajet = async (req, res) => {
  try {
    const trajet = await Trajet.findByIdAndDelete(req.params.id);
    if (!trajet) return res.status(404).json({ message: 'Trajet introuvable' });
    res.status(200).json({ message: 'Trajet supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: err.message });
  }
};
