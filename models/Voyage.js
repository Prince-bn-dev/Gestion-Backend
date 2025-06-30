const mongoose = require('mongoose');

const voyageSchema = new mongoose.Schema({
  vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule', required: true },
  gestionnaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trajet: { type: mongoose.Schema.Types.ObjectId, ref: 'Trajet', required: true },
  date_depart: { type: Date, required: true },
  heure_depart: { type: String, required: true },
  heure_arrivee_Estime: { type: String, required: true },
  prix_par_place: { type: Number, required: true },
  statut: {
    type: String,
    enum: ['Pas_démarrer', 'Pret_a_démarrer', 'terminé', 'annule'],
    default: 'Pas_démarrer'
  }
}, { timestamps: true });

module.exports = mongoose.model('voyage', voyageSchema);
