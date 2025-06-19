const mongoose = require('mongoose');

const vehiculeSchema = new mongoose.Schema({
  immatriculation: { type: String, required: true, unique: true },
  marque: String,
  modele: String,
  type: { type: String , enum: ['voiture', 'camion', 'bus', 'moto'], required: true },
  capacite: { type: Number, required: true },
  kilometrage: Number,
  gps: {
    type: { type: String, enum: ['gps', 'non-gps'], default: 'non-gps' },
    localisation: {
      lat: {type:Number ,default:2.245},
      lng: {type:Number ,default:3.345},
      timestamp: Date
    }
  },
  climatisation: { type: Boolean, default: false },
  chargeur: { type: Boolean, default: false },
  images:[ { type: mongoose.Schema.Types.ObjectId, ref: 'Image'} ],
  gestionnaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true },
  chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parc: { type: mongoose.Schema.Types.ObjectId, ref: 'Parc' },
  statut: { type: String, enum: ['actif', 'maintenance', 'hors_service'], default: 'actif' },
}, { timestamps: true });

module.exports = mongoose.model('Vehicule', vehiculeSchema);
