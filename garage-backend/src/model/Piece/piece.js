const mongoose = require('mongoose')

const pieceSchema = new mongoose.Schema({
    reference: { type: String, required: true },
    designation: { type: String, required: true }
}, { timestamps: true })
module.exports = mongoose.model("Piece", pieceSchema,'piece')