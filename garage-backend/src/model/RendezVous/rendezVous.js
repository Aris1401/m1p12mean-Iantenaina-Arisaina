const mongoose = require('mongoose')

const rendezVousSchema = new mongoose.Schema({
    demande_rendez_vous: { type: mongoose.Types.ObjectId, ref: "DemandeRendezVous" },
    date_rendez_vous: { type: Date },
    etat_rendez_vous: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model("RendezVous", rendezVousSchema);