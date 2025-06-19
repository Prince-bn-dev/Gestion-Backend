const Voyage = require('../models/Voyage');
const Vehicule = require('../models/Vehicule');


exports.createVoyage = async (req, res) => {
  try {
    const {
      vehicule,
      destination,
      date_depart,
      heure_depart,
      heure_arrivee_Estime,
      prix_par_place,
      statut,
    } = req.body;

    const foundVehicule = await Vehicule.findById(vehicule);
    if (!foundVehicule) {
      return res.status(404).json({ error: "Véhicule introuvable" });
    }

    const newVoyage = new Voyage({
      vehicule,
      destination,
      date_depart,
      heure_depart,
      gestionnaire: req.user.id, 
      heure_arrivee_Estime,
      prix_par_place,
      statut, 
    });

    const savedVoyage = await newVoyage.save();
    res.status(201).json(savedVoyage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllVoyages = async (req, res) => {
  try {
    const voyages = await Voyage.find().populate({
        path: 'vehicule',
        populate: {
          path: 'parc' 
        }
      });
    res.status(200).json(voyages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVoyageById = async (req, res) => {
  try {
    const voyage = await Voyage.findById(req.params.id).populate('vehicule');
    if (!voyage) {
      return res.status(404).json({ error: "Voyage introuvable" });
    }
    res.status(200).json(voyage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateVoyage = async (req, res) => {
  try {
    const voyage = await Voyage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!voyage) {
      return res.status(404).json({ error: "Voyage introuvable" });
    }
    res.status(200).json(voyage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteVoyage = async (req, res) => {
  try {
    const voyage = await Voyage.findByIdAndDelete(req.params.id);
    if (!voyage) {
      return res.status(404).json({ error: "Voyage introuvable" });
    }
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
          select: 'nom prenom' // seulement les champs utiles
        }
      });

    res.status(200).json(voyages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getVoyagesByChauffeurVehicule= async (req, res) =>{
    const chauffeurId = req.params.chauffeurId;

  try {
    const vehicules = await Vehicule.find({ chauffeur: chauffeurId }).select('_id');
    const vehiculeIds = vehicules.map(v => v._id);

    if (vehiculeIds.length === 0) {
      return res.status(404).json({ message: "Aucun véhicule assigné à ce chauffeur." });
    }

    const voyages = await Voyage.find({ vehicule: { $in: vehiculeIds } })
      .populate('vehicule')
      .populate('gestionnaire');

    res.status(200).json(voyages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des voyages." });
  }
}
