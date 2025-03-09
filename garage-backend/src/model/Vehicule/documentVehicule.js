const mongoose = require('mongoose')

const documentVehiculeSchema = new mongoose.Schema({
    titre: { type: String },
    description: { type: String },
    fichier: { type: String }
}, { timestamps: true })

module.exports = mongoose.model("DocumentVehicule", documentVehiculeSchema)