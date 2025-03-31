const mongoose = require('mongoose')

const travauxFicheInterventionSchema = new mongoose.Schema({
    fiche_intervention: { type: mongoose.Types.ObjectId, ref: "FicheIntervention" },
    designation: { type: String },
    quantite: { type: Number, default: 1 },
    prix_unitaire: { type: Number, default: 0 },
    prix_ht: { type: Number, default: 0 },
    etat_intervention: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model("TravauxFicheIntervention", travauxFicheInterventionSchema,'travauxficheintervention');