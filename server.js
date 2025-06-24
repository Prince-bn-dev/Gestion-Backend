const express = require("express");
const app = express();
const connectDB = require('./config/db');
require("dotenv").config({ path: "./config/.env" });

const userRoutes = require('./routes/user.routes.js');
const parcRoutes = require('./routes/parc.routes.js');
const vehiculeRoutes = require('./routes/vehicule.routes.js');
const voyageRoutes = require('./routes/voyage.routes.js');
const reservationRoutes = require('./routes/reservation.routes.js');
const paiementRoutes = require('./routes/paiement.routes.js');
const commentaireRoutes = require('./routes/commentaire.routes.js');

const path = require('path');
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'https://gestion-frontend-lyart.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'client/uploads')));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello');
});

connectDB().then(() => {
  app.use('/api/user', userRoutes);
  app.use('/api/parcs', parcRoutes);
  app.use('/api/vehicules', vehiculeRoutes);
  app.use('/api/voyages', voyageRoutes);
  app.use('/api/reservations', reservationRoutes);
  app.use('/api/paiements', paiementRoutes);
  app.use('/api/commentaires', commentaireRoutes);

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  });
});
