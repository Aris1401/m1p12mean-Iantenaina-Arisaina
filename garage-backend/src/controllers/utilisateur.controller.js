const express = require("express");
const route = express.Router();

// Models
const Utilisateur = require("../model/Utilisateur/utilisateur");

// Middleware
const { verifyToken } = require("../middlewares/jwt");
const upload = require('../middlewares/upload')

route.put('/document', [verifyToken, upload.single('document')], async (req, res) => {
    const utilisateur = await Utilisateur.findOne({ _id: req.utilisateurId })

    // New document
    const document = {
        titre: req.body.titre,
        chemin: req.file.path,
        date_ajout: Date.now()
    }

    utilisateur.documents.push(document)
    utilisateur.save()

    return res.status(200).json({
        message: "Document enregistrer avec success",
        data: utilisateur.documents
    })
})

route.get('/document/dowload/:id', [verifyToken], async (req, res) => {
    const utilisateur = await Utilisateur.findOne({ _id: req.utilisateurId })

    
})

module.exports = route