const mongoose = require('mongoose')

const assignationInterventionSchema = new mongoose.Schema({
    intervention: { type: mongoose.Types.ObjectId, ref: "Intervention" },
    mecanicien: { type: mongoose.Types.ObjectId, ref: "Utilisateur" }
}, { timestamps: true })

module.exports = mongoose.model("AssignationIntervention", assignationInterventionSchema)