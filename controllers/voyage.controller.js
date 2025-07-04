const Voyage = require('../models/Voyage');
const Vehicule = require('../models/Vehicule');
const Trajet = require('../models/Trajet');

exports.createVoyage = async (req, res) => {
  try {
    const {
      vehicule,
      trajet,
      date_depart,
      heure_depart,
      heure_arrivee_Estime,
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

    const heureDepart = heure_depart.split(':').map(Number); 
    const heureArrivee = heure_arrivee_Estime.split(':').map(Number); 

    const dateHeureDepart = new Date();
    dateHeureDepart.setHours(heureDepart[0], heureDepart[1], 0);

    const dateHeureArrivee = new Date();
    dateHeureArrivee.setHours(heureArrivee[0], heureArrivee[1], 0);

    if (dateHeureDepart >= dateHeureArrivee) {
      return res.status(400).json({
        error: "L'heure de départ doit être inférieure à l'heure d'arrivée estimée."
      });
    }

    const newVoyage = new Voyage({
      vehicule,
      trajet,
      date_depart,
      heure_depart,
      heure_arrivee_Estime,
      prix_par_place,
      statut,
      gestionnaire: req.user.id
    });

    const savedVoyage = await newVoyage.save();
    res.status(201).json(savedVoyage);
  } catch (error) {
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
