const mongoose = required('mongoose')

const factureSchema = new mongoose.Schema({
    id_intervention: {}, // TODO: Ajouter reference intervention
    reference: { type: String, required: true },
    etat: { type: Number, default: 0 },
    total: { type: Number, default: 0},
    total_ttc: { type: Number, default: 0},
    observation: { type: String }
    // TODO: Ajouter les details
}, { timestamps: true })

module.exports = mongoose.model("Facture", factureSchema)