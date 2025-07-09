const moment = require('moment');
const Voyage = require('../models/Voyage');
const Vehicule = require('../models/Vehicule');
const Trajet = require('../models/Trajet');



function convertDureeToMinutes(dureeStr) {
  const regex = /(?:(\d+)h)?\s*(?:(\d+)min)?/i;
  const match = regex.exec(dureeStr);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);

  return hours * 60 + minutes;
}

exports.createVoyage = async (req, res) => {
  try {
    const {
      vehicule,
      trajet,
      date_depart,
      heure_depart,
      prix_par_place,
      statut
    } = req.body;

    const foundVehicule = await Vehicule.findById(vehicule);
    if (!foundVehicule) return res.status(404).json({ error: "Véhicule introuvable" });

    const foundTrajet = await Trajet.findById(trajet);
    if (!foundTrajet) return res.status(404).json({ error: "Trajet introuvable" });

    const today = new Date();
    const selectedDate = new Date(date_depart);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({ error: "La date de départ ne peut pas être dans le passé." });
    }

    const dureeEnMinutes = convertDureeToMinutes(foundTrajet.duree);

    const heureArriveeEstimee = moment(`${date_depart}T${heure_depart}`)
      .add(dureeEnMinutes, 'minutes')
      .format('HH:mm');

    const newVoyage = new Voyage({
      vehicule,
      trajet,
      date_depart,
      heure_depart,
      heure_arrivee_Estime: heureArriveeEstimee,
      prix_par_place,
      statut,
      gestionnaire: req.user.id
    });

    const savedVoyage = await newVoyage.save();
    res.status(201).json(savedVoyage);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};



exports.getAllVoyages = async (req, res) => {
  try {
    const voyages = await Voyage.find()
       .populate({
          path: 'vehicule',
          populate: { path: 'chauffeur' }
        })
      .populate('trajet')
      .populate('gestionnaire', 'nom prenom');
    res.status(200).json(voyages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getVoyageById = async (req, res) => {
  try {
    const voyage = await Voyage.findById(req.params.id)
      .populate('vehicule')
      .populate('trajet')
      .populate('gestionnaire', 'nom prenom');
    if (!voyage) return res.status(404).json({ error: "Voyage introuvable" });
    res.status(200).json(voyage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateVoyage = async (req, res) => {
  try {
    const voyage = await Voyage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!voyage) return res.status(404).json({ error: "Voyage introuvable" });
    res.status(200).json(voyage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.deleteVoyage = async (req, res) => {
  try {
    const voyage = await Voyage.findByIdAndDelete(req.params.id);
    if (!voyage) return res.status(404).json({ error: "Voyage introuvable" });
    res.status(200).json({ message: "Voyage supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getVoyagesByGestionnaire = async (req, res) => {
  try {
    const gestionnaireId = req.params.gestionnaireId;

    const voyages = await Voyage.find({ gestionnaire: gestionnaireId })
      .populate({
        path: 'vehicule',
        populate: {
          path: 'chauffeur',
          select: 'nom prenom'
        }
      })
      .populate('trajet');

    res.status(200).json(voyages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getVoyagesByChauffeurVehicule = async (req, res) => {
  const chauffeurId = req.params.chauffeurId;

  try {
    const vehicules = await Vehicule.find({ chauffeur: chauffeurId }).select('_id');
    const vehiculeIds = vehicules.map(v => v._id);

    if (vehiculeIds.length === 0) {
      return res.status(404).json({ message: "Aucun véhicule assigné à ce chauffeur." });
    }

    const voyages = await Voyage.find({ vehicule: { $in: vehiculeIds } })
      .populate('vehicule')
      .populate('trajet')
      .populate('gestionnaire', 'nom prenom');

    res.status(200).json(voyages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des voyages." });
  }
};

exports.getVoyagesByTrajet = async (req, res) => {
  const { trajetId } = req.params;

  try {
    const voyages = await Voyage.find({ trajet: trajetId })
      .populate('vehicule')
      .populate('gestionnaire');

    res.status(200).json(voyages);
  } catch (error) {
    console.error("Erreur lors de la récupération des voyages :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des voyages pour ce trajet" });
  }
};
