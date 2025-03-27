const mongoose = require('mongoose')

const interventionSchema = new mongoose.Schema({
    date_debut: { type: Date },
    etat_intervention: { type: Number, default: 0 },
    fiche_intervention: { type: mongoose.Types.ObjectId, ref: "FicheIntervention"},
    devis: { type: mongoose.Types.ObjectId, ref: "Devis" },
    facture: { type: mongoose.Types.ObjectId, ref: "Facture" },
    vehicule: { type: mongoose.Types.ObjectId, ref: "Vehicule" },
    utilisateur: { type: mongoose.Types.ObjectId, ref: "Utilisateur" },
}, { timestamps: true })

module.exports = mongoose.model('Intervention', interventionSchema, 'intervention');