const mongoose = require("mongoose");

const roleUtilisateurSchema = new mongoose.Schema({
    role : { type : String, required : true },
}, { timestamps : true });

module.exports = mongoose.model("RoleUtilisateur", roleUtilisateurSchema);