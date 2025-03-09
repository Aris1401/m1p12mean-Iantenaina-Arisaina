const mongoose = require('mongoose')

const devisTravauxSchema = new mongoose.Schema({
    devis: { type: mongoose.Types.ObjectId, ref: "Devis" },
    designation: { type: String },
    quantite: { type: Number, default: 1 },
    prix_unitaire: { type: Number, default: 0 },
    prix_ht: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model("DevisTravaux", devisTravauxSchema)