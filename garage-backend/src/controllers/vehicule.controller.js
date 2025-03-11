const express = require('express')
const router = express.Router()
const { default: axios } = require('axios')
const path = require('path')

// Modeles
const Vehicule = require('../model/Vehicule/vehicule')
const DocumentVehicule = require('../model/Vehicule/documentVehicule')
const { verifyToken } = require('../middlewares/jwt')

const { uploadFiles, deleteUploadedFiles } = require('../middlewares/upload')
const base64 = require('../_helper/base64Helper')

// Obtenir les informations de vechicules
const carApiUrl = "https://www.carqueryapi.com/api/0.3/?callback=?&"

router.get('/annees', async (req, res) => {
    let anneeStart = 1990
    let anneeEnd = new Date().getFullYear()

    let annees = []
    for (let i = anneeStart; i <= anneeEnd; i++) {
        annees.push({ annee: i})
    }

    return res.status(200).json({
        data: annees
    })
})

router.get('/marques', async (req, res) => {
    const marques = await axios("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json")

    return res.status(200).json({
        data: marques.data
    })
})

router.get('/modeles', async (req, res) => {
    if (!req.query.marque || !req.query.annee) {
        return res.status(400).json({
            error: "Une erreur s\'est produite"
        })
    }

    const modeles = await axios(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${ req.query.marque }/modelyear/${ req.query.annee }?format=json`)

    return res.status(200).json({
        data: modeles.data
    })
})

router.get('/boite-vitesse', async (req, res) => {
    const boiteVitesse = await axios("https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablevalueslist/Transmission Style?format=json")

    return res.status(200).json({
        data: boiteVitesse.data
    })
})

router.get('/carburant', async (req, res) => {
    const carburant = await axios("https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablevalueslist/Fuel Type - Primary?format=json")

    return res.status(200).json({
        data: carburant.data
    })
})

// ----------------------- VEHICULE

// Obtenir tout les vehicules d'un utilisateur
router.get('/', [verifyToken], async (req, res) => {
    const vehicules = await Vehicule.find({ utilisateur: req.utilisateurId }).sort({ createdAt: -1 })

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
router.post('/', [verifyToken, uploadFiles.array("images[]")], async (req, res) => {
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

    if (req.files) {
        req.files.forEach(file => {
            vehicule.images.push(base64(file.path))
        })
    }

    const errors = vehicule.validateSync()

    if (errors) {
        deleteUploadedFiles(req.files)

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

// Documents
router.get('/:id/documents', [verifyToken], async (req, res) => {
    const documents = await DocumentVehicule.find({ vehicule: req.params.id })

    return res.status(200).json({
        data: documents
    })
})

router.get('/:id/documents/:idDoc', async (req, res) => {
    const document = await DocumentVehicule.findOne({ vehicule: req.params.id, _id: req.params.idDoc })

    return res.download(document.fichier)
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