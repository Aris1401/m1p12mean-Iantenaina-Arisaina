const mongoose = require("mongoose");

const factureSchema = new mongoose.Schema(
  {
    intervention: { type: mongoose.Types.ObjectId, ref: "Intervention" },
    reference: { type: String },
    etat: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    total_ttc: { type: Number, default: 0 },
    observation: { type: String },
  },
  { timestamps: true }
);

factureSchema.pre("save", async function (next) {
  if (!this.reference) {
    const lastFacture = await this.constructor
      .findOne()
      .sort({ reference: -1 });

    let newNumber = 1;
    if (lastFacture && lastFacture.reference) {
      const lastNumber = parseInt(lastFacture.reference.replace("FAC", ""), 10);
      newNumber = lastNumber + 1;
    }

    this.reference = `FAC${String(newNumber).padStart(3, "0")}`; // Ensures FAC001, FAC002, etc.
  }
  next();
});

module.exports = mongoose.model("Facture", factureSchema);
