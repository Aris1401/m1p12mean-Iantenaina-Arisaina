const mongoose = require('mongoose')

const documentVehiculeSchema = new mongoose.Schema({
    vehicule: { type: mongoose.Types.ObjectId, ref: "Vehicule" },
    titre: { type: String },
    description: { type: String },
    fichier: { type: String }
}, { timestamps: true })

module.exports = mongoose.model("DocumentVehicule", documentVehiculeSchema)