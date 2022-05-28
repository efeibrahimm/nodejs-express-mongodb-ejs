const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URI,{useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => { console.log("Veritabanına Bağlanıldı"); })
    .catch((err) => { console.log('veritabanına bağlanamadı: ' + err) })