const express = require('express')
const router = express.Router()

// Modeles
const Vehicule = require('../model/Vehicule/vehicule')
const DocumentVehicule = require('../model/Vehicule/documentVehicule')
const { verifyToken } = require('../middlewares/jwt')
const uploadFiles = require('../middlewares/upload')

// Obtenir tout les vehicules d'un utilisateur
router.get('/', [verifyToken], async (req, res) => {
    const vehicules = await Vehicule.find({ utilisateur: req.utilisateurId })

    return res.status(200).json({
        data: vehicules
    })
})

// Obtenir vehicule par id
router.get('/:id', [verifyToken], async (req, res) => {
    const vehicule = await Vehicule.findOne({ _id: req.params.id })

    if (!vehicule) {
        return res.status(400).json({
            error: "Aucune voiture trouver"
        })
    }

    return res.status(200).json({
        data: vehicule
    })
})

// Ajouter un vehicule
router.post('/', [verifyToken], async (req, res) => {
    const vehicule = new Vehicule({
        marque: req.body.marque,
        modele: req.body.modele,
        annee: req.body.annee,
        immatriculation: req.body.immatriculation,
        kilometrage: req.body.kilometrage,
        boite_de_vitesse: req.body.boite_de_vitesse,
        carburant: req.body.carburant,
        utilisateur: req.utilisateurId
    });

    const errors = vehicule.validateSync()

    if (errors) {
        return res.status(400).json({
            error: errors.errors
        })
    } else {
        await vehicule.save()

        return res.status(200).json({
            message: "Vehicule enregistrer avec success"
        })
    }
})

// Documes
router.get('/:id/documents', [verifyToken], async (req, res) => {
    const documents = await DocumentVehicule.find({ vehicule: req.params.id })

    return res.status(200).json({
        data: documents
    })
})

router.post('/:id/documents', [verifyToken, uploadFiles.single('document')], async (req, res) => {
    const document = new DocumentVehicule({
        titre: req.body.titre,
        description: req.body.description,
        fichier: req.file.path,
        vehicule: req.params.id
    })

    await document.save()

    return res.status(200).json({
        message: "Document enregistrer avec succes"
    })
})

module.exports = router