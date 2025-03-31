const mongoose = require('mongoose')

const typeInterventionSchema = new mongoose.Schema({
    designation: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model("TypeIntervention", typeInterventionSchema, 'typeintervention')