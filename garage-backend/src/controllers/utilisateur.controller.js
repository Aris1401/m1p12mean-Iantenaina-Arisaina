const express = require("express");
const route = express.Router();

// Models
const Utilisateur = require("../model/Utilisateur/utilisateur");

// Middleware
const { verifyToken } = require("../middlewares/jwt");
const { uploadFiles } = require('../middlewares/upload')

route.put('/document', [verifyToken, uploadFiles.single('document')], async (req, res) => {
    const utilisateur = await Utilisateur.findOne({ _id: req.utilisateurId })

    if (!req.file) {
        return res.status(400).json({
            error: "Veuillez fournir un fichier"
        })
    }

    // console.log(req.file)

    // New document
    const document = {
        titre: req.body.titre,
        chemin: req.file.filename,
        date_ajout: Date.now()
    }

    utilisateur.documents.push(document)
    await utilisateur.save({ validateBeforeSave: false })

    return res.status(200).json({
        message: "Document enregistrer avec success",
        data: utilisateur.documents
    })
})

route.get('/document/dowload/:id', [verifyToken], async (req, res) => {
    const utilisateur = await Utilisateur.findOne({ "documents._id": req.params.id }, { "documents.$": 1 })

    return res.download("upload/" + utilisateur.documents[0].chemin)
})

route.delete("/document/:id", [verifyToken], async (req, res) => {
    try {
        const userId = req.utilisateurId;
        const documentId = req.params.id;

        const updatedUser = await Utilisateur.findOneAndUpdate(
            { _id: userId },
            { $pull: { documents: { _id: documentId } } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ error: "Utilisateur non trouvé" });
        }

        return res.status(200).json({ message: "Document supprimé avec succès", data: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: "Erreur serveur", error });
    }
});

module.exports = route