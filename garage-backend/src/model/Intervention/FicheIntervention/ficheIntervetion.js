const mongoose = require('mongoose')

const ficheInterventionSchema = new mongoose.Schema({
    intervention: { type: mongoose.Types.ObjectId, ref: "Intervention" },
    description: { type: String },
    type_intervention: { type: mongoose.Types.ObjectId, ref: "TypeIntervention" },
    type_evenement: { type: mongoose.Types.ObjectId, ref: "TypeEvenement" },
    autre_evenement: { type: String },
    documents: [
        {
            description: { type: String },
            image: { type: String }
        }
    ]
    // Ajouter references aux details
}, {timestamps: true})

module.exports = mongoose.model("FicheIntervention", ficheInterventionSchema,'ficheintervention')