const mongoose = require('mongoose')

const pieceFicheInterventionSchema = new mongoose.Schema({
    fiche_intervention: { type: mongoose.Types.ObjectId, ref: "FicheIntervention" },
    piece: { type: mongoose.Types.ObjectId, ref: "Piece" },
    quantite: { type: Number, default: 1 },
    prix_unitaire: { type: Number, default: 0 },
    prix_ht: { type: Number, default: 0 },
    etat_intervention: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model("PieceFicheIntervention", pieceFicheInterventionSchema);