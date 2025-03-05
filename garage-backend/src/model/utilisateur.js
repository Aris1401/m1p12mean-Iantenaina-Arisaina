const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema({
    nom : { type : String, required : true },
    prenom : { type : String, required : true },
    email : { type : String, required : true },
    mot_de_passe : { type : String, required : true },
    roles : [{ type : mongoose.Schema.Types.ObjectId, ref : "RoleUtilisateur" }]
}, { timestamps : true });

module.exports = mongoose.model("Utilisateur", utilisateurSchema);