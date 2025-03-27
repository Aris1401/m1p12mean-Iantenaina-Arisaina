const mongoose = require('mongoose')

const vehiculeSchema = new mongoose.Schema({
    marque: { type: String, required: true },
    modele: { type: String },
    annee: { type: Number, required: true },
    immatriculation: { type: String, required: true },
    kilometrage: { type: Number, default: 0 },
    boite_de_vitesse: { type: String, required: true },
    carburant: { type: String, required: true },
    utilisateur: { type: mongoose.Types.ObjectId, ref: "Utilisateur" },
    images: [ { type: String } ],
}, { timestamps: true })

module.exports = mongoose.model("Vehicule", vehiculeSchema)