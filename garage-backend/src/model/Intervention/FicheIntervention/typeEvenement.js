const mongoose = require('mongoose')

const typeEvenementSchema = new mongoose.Schema({
    designation: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model("TypeEvenement", typeEvenementSchema)