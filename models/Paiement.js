const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  montant: { type: Number, required: true },
  kkiapay_id: { type: String},
  statut: { type: String, enum: ['effectue', 'echoue'], default: 'effectue' },
  date_paiement: { type: Date, default: Date.now }
}, { timestamps: true });


paiementSchema.index({ kkiapay_id: 1 }, { unique: true, sparse: true });


module.exports = mongoose.model('Paiement', paiementSchema);
