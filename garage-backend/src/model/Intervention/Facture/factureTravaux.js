const mongoose = require('mongoose')

const factureTravauxSchema = new mongoose.Schema({
    devis: { type: mongoose.Types.ObjectId, ref: "Facture" },
    designation: { type: String },
    quantite: { type: Number, default: 1 },
    prix_unitaire: { type: Number, default: 0 },
    prix_ht: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model("FacturePiece", factureTravauxSchema)