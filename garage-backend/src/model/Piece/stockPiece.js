const mongoose = require('mongoose')

const stockPieceSchema = new mongoose.Schema({
    piece: { type: mongoose.Types.ObjectId, ref: "Piece" },
    date_mouvement: { type: Date },
    entree: { type: Number, default: 0, min: [0, 'La quantite ne peut pas etre negatif'] },
    sortie: { type: Number, default: 0, min: [0, 'La quantite ne paut pas etre negatif'] },
    prix_unitaire: { type: Number, default: 0, min: [0, 'Le prix ne peut pas etre negatif'] }
}, { timestamps: true })

module.exports = mongoose.model("StockPiece", stockPieceSchema)



