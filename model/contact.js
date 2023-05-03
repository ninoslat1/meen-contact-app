const mongoose = require('mongoose')
const Contact = mongoose.model('Contact', {
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
})

module.exports = Contact;