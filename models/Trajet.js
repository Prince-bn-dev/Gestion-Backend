const mongoose = require('mongoose');

const trajetSchema = new mongoose.Schema({
  lieux_depart: { type: String,  required: true },
  lieux_arrive: { type: String,  required: true },
}, { timestamps: true });

module.exports = mongoose.model('Trajet', trajetSchema);