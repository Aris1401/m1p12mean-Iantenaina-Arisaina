const express = require("express");
const route = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const config = require("../config/auth.config");

// Models
const Utilisateur = require("../model/utilisateur");
const RoleUtilisateur = require("../model/roleUtilisateur");

route.get('/login', async (req, res) => {
    const email = req.body.email;
    const motDePasse = req.body.mot_de_passe;

    if (!email || !motDePasse) {
        return res.status(400).send({ message: "Champs vides !" });
    }

    const utilisateur = await Utilisateur.findOne({ email: email });

    if (!utilisateur) {
        return res.status(404).send({ message: "Utilisateur non trouvé !" });
    }

    const motDePasseValide = utilisateur.mot_de_passe === motDePasse;

    if (!motDePasseValide) {
        return res.status(401).send({ message: "Mot de passe incorrect !" });
    }

    const token = jsonwebtoken.sign({ id: utilisateur._id }, config.secret, {
        expiresIn: 86400
    });

    res.status(200).send({ message: "Connexion réussie !", token: token });
});

route.post('/register', async (req, res) => {
    const roleUtilisateur = await RoleUtilisateur.findOne({ role: "ROLE_USER" });

    const utilisateur = new Utilisateur({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        mot_de_passe: req.body.mot_de_passe,
        roles: [
            roleUtilisateur._id
        ]
    });

    await utilisateur.save();

    res.status(201).send({ message: "Utilisateur créé avec succès !" });
});

module.exports = route;