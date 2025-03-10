const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema({
    nom : { type : String, required : [true, "Veuillez entrer votre nom"] },
    prenom : { type : String, required : [true, "Veuillez entrer votre prenom"] },
    email : { type : String, required : [true, "Veuillez entrer votre email"] },
    mot_de_passe : { type : String, required : [true, "Veuillez entrer votre mot de passe"] },
    date_naissance : { type: Date, required: [true, "Veuillez entre votre date de naissance"]},
    telephone : { type: String, required: [true, "Veuillez entrer votre numero de telephone"]},
    adresse : { type: String, required: [true, "Veuillez entrer votre adresse"]},
    documents : [
        { 
            titre: { type: String },
            chemin: { type: String},
            date_ajout: { type: Date }
        }
    ],
    photo_profil: { type: String },
    roles : [{ type : mongoose.Schema.Types.ObjectId, ref : "RoleUtilisateur" }]
}, { timestamps : true });

module.exports = mongoose.model("Utilisateur", utilisateurSchema);