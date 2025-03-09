const mongoose = required('mongoose')

const devisSchema = new mongoose.Schema({
    id_intervention: {}, // TODO: Ajouter reference intervention
    etat: { type: Number, default: 0 },
    total: { type: Number, default: 0},
    total_ttc: { type: Number, default: 0}
    // TODO: Ajouter les details
}, { timestamps: true })

module.exports = mongoose.model("Devis", devisSchema)