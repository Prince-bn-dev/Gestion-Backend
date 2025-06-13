const mongoose = require('mongoose');

const parcSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  localisation: {type:String},
  description: {type:String},
  heures_ouverture: { type: String, required: true },
  heures_fermeture: { type: String, required: true },
  gestionnaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Parc', parcSchema);
