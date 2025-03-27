const mongoose = require('mongoose')

const devisPieceSchema = new mongoose.Schema({
    devis: { type: mongoose.Types.ObjectId, ref: "Devis" },
    piece: {}, // TODO: Ajouter reference piece,
    quantite: { type: Number, default: 1 },
    prix_unitaire: { type: Number, default: 0 },
    prix_ht: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model("DevisPiece", devisPieceSchema)