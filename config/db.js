const mongoose = require('mongoose');
require('dotenv/config')

mongoose.connect(process.env.DATA_URL)
    .then(() => console.log('Connexion à la base de données réussie'))