const mongoose = require('mongoose')

const facturePieceSchema = new mongoose.Schema({
    facture: { type: mongoose.Types.ObjectId, ref: "Facture" },
    piece: { type: mongoose.Types.ObjectId, ref: "Piece" },
    quantite: { type: Number, default: 1 },
    prix_unitaire: { type: Number, default: 0 },
    prix_ht: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model("FacturePiece", facturePieceSchema)