const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  voyage: { type: mongoose.Schema.Types.ObjectId, ref: 'Voyage', required: true },
  voyageur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nombre_places: { type: Number, required: true },
  paiement: { type: mongoose.Schema.Types.ObjectId, ref: 'Paiement' },
  statut: { type: String, enum: ['en_attente', 'confirmee', 'annulee'], default: 'en_attente' },
  date_reservation: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
