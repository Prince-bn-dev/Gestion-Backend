const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch((err) => console.error('❌ Erreur de connexion MongoDB :', err));
