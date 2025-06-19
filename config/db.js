const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

mongoose.connect(process.env.DB_USER_PASS)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch((err) => console.error('❌ Erreur de connexion MongoDB :', err));
