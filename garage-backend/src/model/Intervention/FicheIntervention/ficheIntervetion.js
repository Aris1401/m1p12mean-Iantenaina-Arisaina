const mongoose = require('mongoose')

const ficheInterventionSchema = new mongoose.Schema({
    intervention: {}, // TODO: Ajouter reference a l'intervention
    description: { type: String },
    type_intervention: {}, // TODO: Ajouter reference a l'intervention
    type_evenement: {}, // TODO: Ajouter reference au type d'evenement
    autre_evenement: { type: String },
    documents: [
        {
            description: { type: String },
            image: { type: String }
        }
    ]
    // Ajouter references aux details
}, {timestamps: true})

module.exports = mongoose.model("FicheIntervention", ficheInterventionSchema)