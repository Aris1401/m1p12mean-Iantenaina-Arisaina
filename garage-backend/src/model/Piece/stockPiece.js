const mongoose = require('mongoose')

const stockPieceSchema = new mongoose.Schema({
    piece: { type: mongoose.Types.ObjectId, ref: "Piece" },
    date_mouvement: { type: Date },
    entree: { type: Number, default: 0 },
    sortie: { type: Number, default: 0 },
    prix_unitaire: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model("StockPiece", stockPieceSchema)