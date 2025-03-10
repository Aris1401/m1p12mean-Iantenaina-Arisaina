const mongoose = require('mongoose')

const vehiculeSchema = new mongoose.Schema({
    marque: { type: String },
    modele: { type: String },
    annee: { type: Number },
    immatriculation: { type: String },
    kilometrage: { type: Number, default: 0 },
    boite_de_vitesse: { type: String },
    carburant: { type: String },
    utilisateur: { type: mongoose.Types.ObjectId, ref: "Utilisateur" },
    images: [ { type: String } ],
}, { timestamps: true })

module.exports = mongoose.model("Vehicule", vehiculeSchema)