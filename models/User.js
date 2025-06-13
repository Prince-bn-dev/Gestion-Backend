const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String },
  prenom: { type: String },
  email: { type: String, unique: true, sparse: true },
  telephone: { type: String, unique: true, sparse: true },
  smsCode: { type: String },
  smsCodeExpires: { type: Date },
  smsResetCodeExpires: { type: Date },
  smsResetCode: { type: String },
  telephoneVerified: { type: Boolean, default: false },
  motDePasse: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'gestionnaire', 'chauffeur', 'voyageur'],
    default: 'voyageur'
  },
  emailVerified: { type: Boolean, default: false },
  emailToken: { type: String },
  resetPasswordToken: { type: String },
  actif: { type: Boolean, default: true },
  image: { type: String, default: 'default-avatar.png' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
