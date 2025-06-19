const mongoose =  require('mongoose')
require('dotenv').config({path : './config/.env'})



mongoose.connect(process.env.DB_USER_PASS
).then(()=>console.log('connection a mongodb'))
.catch((err)=>console.log( err))