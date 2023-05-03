const mongoose = require('mongoose')
mongoose.connect(process.env.CONTACT_ENV_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})