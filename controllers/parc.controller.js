const Parc = require('../models/Parc');
const User = require('../models/User');


exports.createParc = async (req, res) => {
 const { nom, localisation, description, heures_ouverture, heures_fermeture, gestionnaire } = req.body;
    try {
        const gestionnaireExist = await User.findById(gestionnaire);
        if (!gestionnaireExist) {
        return res.status(404).json({ message: 'Gestionnaire non trouvé' });
        }
    
        const parc = new Parc({
        nom,
        localisation,
        description,
        heures_ouverture,
        heures_fermeture,
        gestionnaire
        });
    
        await parc.save();
        res.status(201).json(parc);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getParcs = async (req, res) => {
  try {
    const parcs = await Parc.find().populate('gestionnaire', 'nom email');
    res.status(200).json(parcs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParcById = async (req, res) => {
  try {
    const parc = await Parc.findById(req.params.id).populate('gestionnaire', 'nom email');
    if (!parc) return res.status(404).json({ message: 'Parc non trouvé' });
    res.status(200).json(parc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateParc = async (req, res) => {
  try {
    const parc = await Parc.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!parc) return res.status(404).json({ message: 'Parc non trouvé' });
    res.status(200).json(parc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getParcsByGestionnaire = async (req, res) => {
  try {
    const gestionnaireId = req.params.id; 
    const parcs = await Parc.find({ gestionnaire: gestionnaireId }).populate('gestionnaire', 'nom email');
    res.status(200).json(parcs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}