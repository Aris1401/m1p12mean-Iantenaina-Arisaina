const mongoose = require('mongoose')

const demandeRendezVousSchema = new mongoose.Schema({
    utilisateur: { type: mongoose.Types.ObjectId, ref: "Utilisateur" },
    vehicule: {}, // TODO: Ajouter reference au vehicule
    titre: { type: String},
    type_rendez_vous: {}, // TODO: Ajouter reference au type de rendez vous
    date_souhaiter: { type: Date },
    date_suggerer: { type: Date },
    etat_demande: { type: Number, default: 0 },
    intervention: { type: mongoose.Types.ObjectId, ref: "Intervention" }
}, { timestamps: true })

module.exports = mongoose.model("DemandeRendezVous", demandeRendezVousSchema);