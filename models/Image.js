const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {type:String},
  vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' },
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
