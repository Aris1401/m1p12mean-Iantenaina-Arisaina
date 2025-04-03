const mongoose = require("mongoose");

const devisSchema = new mongoose.Schema(
  {
    intervention: { type: mongoose.Types.ObjectId, ref: "Intervention" },
    reference: { type: String },
    etat: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    total_ttc: { type: Number, default: 0 },
  },
  { timestamps: true }
);

devisSchema.pre("save", async function (next) {
  if (!this.reference) {
    const lastDoc = await this.constructor.findOne().sort({ createdAt: -1 });

    let lastRefId = 0; // Default to 0 if no previous document exists
    if (lastDoc && lastDoc.reference) {
      const extractedNumber = lastDoc.reference.replace("DEV", "");
      lastRefId = isNaN(parseInt(extractedNumber, 10)) ? 0 : parseInt(extractedNumber, 10);
    }

    this.reference = `DEV${String(lastRefId + 1).padStart(3, "0")}`; // e.g., DEV001, DEV002
  }
  next();
});


module.exports = mongoose.model("Devis", devisSchema);
