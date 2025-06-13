const mongoose =  require('mongoose')
require('dotenv').config({path : './config/.env'})



mongoose.connect(
'mongodb+srv://'+process.env.DB_USER_PASS+'@gestionvehicule.dnbj5rj.mongodb.net/gestionVehicule'
).then(()=>console.log('connection a mongodb'))
.catch((err)=>console.log( err))