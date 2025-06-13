const Commentaire = require('../models/Commentaire');


exports.createCommentaire = async (req, res) => {
  try {
    const { voyage, auteur, texte, note } = req.body;

    if (!voyage || !auteur || !texte) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const commentaire = new Commentaire({ voyage, auteur, texte, note });
    await commentaire.save();
    res.status(201).json(commentaire);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



exports.getCommentaires = async (req, res) => {
  try {
    const commentaires = await Commentaire.find()
      .populate('voyage', 'lieu_depart lieu_arrivee')
      .populate('auteur', 'nom email');
    res.status(200).json(commentaires);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommentairesByVoyage = async (req, res) => {
  try {
    const commentaires = await Commentaire.find({ voyage: req.params.voyageId })
      .populate('voyage', 'lieu_depart lieu_arrivee')
      .populate('auteur', 'nom email image');
    if (commentaires.length === 0) {
      return res.status(404).json({ message: 'Aucun commentaire trouvé pour ce voyage' });
    }
    res.status(200).json(commentaires);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


exports.getCommentaireById = async (req, res) => {
  try {
    const commentaire = await Commentaire.findById(req.params.id)
      .populate('voyage', 'lieu_depart lieu_arrivee')
      .populate('auteur', 'nom email');
    if (!commentaire) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }
    res.status(200).json(commentaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateCommentaire = async (req, res) => {
  try {
    const commentaire = await Commentaire.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!commentaire) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }
    res.status(200).json(commentaire);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCommentaire = async (req, res) => {
  try {
    const commentaire = await Commentaire.findByIdAndDelete(req.params.id);
    if (!commentaire) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }
    res.status(200).json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
