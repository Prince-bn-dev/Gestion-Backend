const Vehicule = require('../models/Vehicule');
const User = require('../models/User');
const Parc = require('../models/Parc');
const Image = require('../models/Image');


exports.createVehicule = async (req, res) => {
  try {
    const {
      immatriculation,
      marque,
      modele,
      type,
      capacite,
      kilometrage,
      gps,
      climatisation,
      chargeur,
      chauffeur,
      parc,
      statut,
    } = req.body;

    if (chauffeur) {
      const user = await User.findById(chauffeur);
      if (!user) return res.status(404).json({ error: "Chauffeur introuvable" });
    }

    if (parc) {
      const foundParc = await Parc.findById(parc);
      if (!foundParc) return res.status(404).json({ error: "Parc introuvable" });
    }

    const newVehicule = new Vehicule({
      immatriculation,
      marque,
      modele,
      type,
      capacite,
      kilometrage,
      gps,
      climatisation,
      gestionnaire: req.user.id,
      chargeur,
      chauffeur,
      parc,
      statut
    });

    const savedVehicule = await newVehicule.save();
    res.status(201).json(savedVehicule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllVehicules = async (req, res) => {
  try {
    const vehicules = await Vehicule.find()
      .populate('images')
      .populate('chauffeur')
      .populate('parc');
    res.status(200).json(vehicules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVehiculeById = async (req, res) => {
  try {
    const vehicule = await Vehicule.findById(req.params.id)
      .populate('images')
      .populate('chauffeur')
      .populate('parc');
    if (!vehicule) return res.status(404).json({ error: "Véhicule introuvable" });
    res.status(200).json(vehicule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateVehicule = async (req, res) => {
  try {
    const vehicule = await Vehicule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicule) return res.status(404).json({ error: "Véhicule introuvable" });
    res.status(200).json(vehicule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteVehicule = async (req, res) => {
  try {
    const vehicule = await Vehicule.findByIdAndDelete(req.params.id);
    if (!vehicule) return res.status(404).json({ error: "Véhicule introuvable" });
    res.status(200).json({ message: "Véhicule supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVehiculesByParc = async (req, res) => {
  try {
    const parcId = req.params.id;
    const vehicules = await Vehicule.find({ parc: parcId })
      .populate('images')
      .populate('chauffeur')
      .populate('parc');
    res.status(200).json(vehicules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVehiculesByChauffeur = async (req, res) => {
  try {
    const chauffeurId = req.params.id;
    const vehicules = await Vehicule.find({ chauffeur: chauffeurId })
      .populate('images')
      .populate('chauffeur')
      .populate('parc');
    res.status(200).json(vehicules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVehiculesByGestionnaire = async (req, res) => {
  try {
    const gestionnaireId = req.params.id;
    const vehicules = await Vehicule.find({ gestionnaire: gestionnaireId })
      .populate('images')
      .populate('chauffeur')
      .populate('parc')
      .populate('gestionnaire');
    res.status(200).json(vehicules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.uploadVehiculeImage = async (req, res) => {
  try {
    const { vehiculeId } = req.params;
    const vehicule = await Vehicule.findById(vehiculeId);
    if (!vehicule) return res.status(404).json({ error: 'Véhicule non trouvé' });

    const newImage = new Image({
      url: `/uploads/${req.file.filename}`,
      vehicule: vehicule._id,
    });
    await newImage.save();

    vehicule.images.push(newImage._id);
    await vehicule.save();

    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.addChauffeurByVehicule = async (req, res) => {
  try {
    const { chauffeurId } = req.body;
    const { id } = req.params;

    console.log("ID Véhicule:", id);
    console.log("ID Chauffeur:", chauffeurId);

    const vehicule = await Vehicule.findById(id);
    if (!vehicule) return res.status(404).json({ error: "Véhicule introuvable" });

    const chauffeur = await User.findById(chauffeurId);
    if (!chauffeur) return res.status(404).json({ error: "Utilisateur introuvable" });
    if (chauffeur.role !== "chauffeur") return res.status(400).json({ error: "L'utilisateur n'est pas un chauffeur" }); // Corrige le message d'erreur

    vehicule.chauffeur = chauffeurId;
    await vehicule.save();

    res.status(200).json({ message: "Chauffeur ajouté au véhicule", vehicule });
  } catch (error) {
    console.error("Erreur backend:", error); 
    res.status(500).json({ error: error.message });
  }
};

