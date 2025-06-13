const mongoose = require('mongoose');

const commentaireSchema = new mongoose.Schema({
  voyage: { type: mongoose.Schema.Types.ObjectId, ref: 'Voyage', required: true },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  texte: { type: String, required: true },
  note: { type: Number, min: 1, max: 5 }, 
  date_commentaire: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Commentaire', commentaireSchema);
