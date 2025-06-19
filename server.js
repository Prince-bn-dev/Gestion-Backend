const express = require("express")
const app = express()
require('./config/db.js')
require("dotenv").config({path:"./config/.env"})
const userRoutes = require('./routes/user.routes.js')
const parcRoutes = require('./routes/parc.routes.js');
const vehiculeRoutes = require('./routes/vehicule.routes.js');
const voyageRoutes = require('./routes/voyage.routes.js');
const reservationRoutes = require('./routes/reservation.routes.js');
const paiementRoutes = require('./routes/paiement.routes.js');
const commentaireRoutes = require('./routes/commentaire.routes.js');
const path = require('path');

const cors = require('cors');


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));
app.use('/uploads', express.static(path.join(__dirname, 'client/uploads')));
app.use(express.json());

app.get('/',(req,res)=>{
 res.send('hello')
})
app.use('/api/user',userRoutes)
app.use('/api/parcs', parcRoutes);
app.use('/api/vehicules', vehiculeRoutes);
app.use('/api/voyages', voyageRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/paiements', paiementRoutes);  
app.use('/api/commentaires', commentaireRoutes);



app.listen(process.env.PORT , ()=>{
  console.log(`Connection au port ${process.env.PORT}`);
})