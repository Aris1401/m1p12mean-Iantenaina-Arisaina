const mongoose = require('mongoose')

const demandeRendezVousSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Types.ObjectId, ref: "Utilisateur", required: true },
    vehicule: { type: mongoose.Types.ObjectId, ref: "Vehicule", required: true },
    titre: { type: String},
    description: { type: String },
    type_rendez_vous: { type: mongoose.Types.ObjectId, ref: "TypeRendezVous", required: true},
    date_souhaiter: { type: Date, required: true },
    date_suggerer: { type: Date },
    etat_demande: { type: Number, default: 0 },
    intervention: { type: mongoose.Types.ObjectId, ref: "Intervention" }
}, { timestamps: true })

module.exports = mongoose.model("DemandeRendezVous", demandeRendezVousSchema);