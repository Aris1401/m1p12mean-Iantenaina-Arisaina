const mongoose = require('mongoose')

const typeRendezVousSchema = new mongoose.Schema({
    designation: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model("TypeRendezVous", typeRendezVousSchema)