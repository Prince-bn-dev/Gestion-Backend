const mongoose = require('mongoose');

const voyageSchema = new mongoose.Schema({
  vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule', required: true },
  gestionnaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  date_depart: { type: Date, required: true },
  heure_depart: { type: String, required: true },
  heure_arrivee_Estime: { type: String, required: true },
  prix_par_place: { type: Number, required: true },
  statut: { type: String, enum: ['nonInitier','encours', 'termine', 'annule'], default: 'encours' },
}, { timestamps: true });

module.exports = mongoose.model('Voyage', voyageSchema);
