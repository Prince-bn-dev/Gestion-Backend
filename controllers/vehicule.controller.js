const Vehicule = require('../models/Vehicule');
const User = require('../models/User');
const Parc = require('../models/Parc');
const Image = require('../models/Image');
const { uploadErrors} = require('../Utils/error')
const fs = require("fs");
const path = require("path");

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
      .populate('gestionnaire')
      .populate('parc');
    res.status(200).json(vehicules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGPS = async (req, res) => {
  const { lat, lng } = req.body;

  try {
    const vehicule = await Vehicule.findByIdAndUpdate(
      req.params.id,
      {
        gps: {
          type: 'gps',
          localisation: {
            lat,
            lng,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    res.status(200).json(vehicule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour GPS" });
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

    if (!req.file) {
      throw new Error("Aucun fichier reçu");
    }

    const vehicule = await Vehicule.findById(vehiculeId);
    if (!vehicule) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }
    const newImage = new Image({
      url: req.file.path,
      vehicule: vehicule._id,
    });

    await newImage.save();
    vehicule.images.push(newImage._id);
    await vehicule.save();

    res.status(201).json({
      message: "Image du véhicule enregistrée avec succès.",
      image: newImage,
    });
  } catch (error) {
    console.error("Erreur uploadVehiculeImage :", error.message);
    const err = uploadErrors ? uploadErrors(error) : error.message;
    res.status(400).json({ error: err });
  }
};

exports.deleteVehiculeImage = async (req, res) => {
  try {
    const { imageId, vehiculeId } = req.params;

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ error: "Image non trouvée" });
    }

    await Vehicule.findByIdAndUpdate(vehiculeId, {
      $pull: { images: image._id },
    });

    const imagePath = path.join(__dirname, "..", image.url);
    fs.unlink(imagePath, (err) => {
      if (err) console.warn("Fichier non supprimé :", err.message);
    });

    await image.deleteOne();

    res.status(200).json({ message: "Image supprimée avec succès" });
  } catch (error) {
    console.error("Erreur deleteVehiculeImage :", error.message);
    res.status(500).json({ error: error.message });
  }
};

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

