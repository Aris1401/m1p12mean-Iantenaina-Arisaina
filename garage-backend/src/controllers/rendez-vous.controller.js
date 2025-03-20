const express = require('express')
const router = express.Router()
// Modeles
const TypeRendezVous = require('../model/RendezVous/typeRendezVous')
const DemandeRendezVous = require('../model/RendezVous/demandeRendezVous')
const RendezVous = require('../model/RendezVous/rendezVous')

const { EtatDemandeRendezVous } = require('../model/Etats')

const { verifyToken, isManager, isUtilisateur } = require('../middlewares/jwt')
const rendezVous = require('../model/RendezVous/rendezVous')

// Services
const RendezVousService = require('../services/rendezVousService')

// Types de rendez-vous
router.get('/types', async (req, res) => {
        const types = await TypeRendezVous.find();
        return res.status(200).json({
            data: types
        });
});

// Liste de tout les demandes
router.get('/demandes', [verifyToken], async (req, res) => {
    const demandes = await DemandeRendezVous.find().populate('vehicule').populate('type_rendez_vous').sort({ date_souhaiter: -1 });

    return res.status(200).json({
        data: demandes
    })
})

// Validation de demande rendez vous
router.post('/demandes/:id/valider', [verifyToken, isManager], async (req, res) => {
    try {
        await RendezVousService.validerDemandeRendezVous(req.params.id)
    } catch (err) {
        return res.status(200).json({
            error: err.message
        })
    }

    return res.status(200).json({
        message: "Demande de rendez-vous valider avec success"
    })
})

// Ajout de demande rendez vous
router.post('/demandes', [verifyToken], async (req, res) => {
    const demande = new DemandeRendezVous({
        utilisateur: req.utilisateurId,
        vehicule: req.body.vehicule,
        titre: req.body.titre,
        description: req.body.description,
        type_rendez_vous: req.body.type,
        date_souhaiter: req.body.date,
        date_suggerer: req.body.date,
        etat_demande: EtatDemandeRendezVous.EN_COURS,
    })

    const errors = demande.validateSync()

    if (errors) {
        return res.status(400).json({
            error: 'Veuillez verifier les entrees',
            data: errors.errors
        })
    }

    await demande.save()
    return res.status(200).json({
        message: "Demande enregistrer avec succes"
    })
})

// Liste de tous les rendez-vous
router.get('/rdv', async (req, res) => {
    const rdv = await rendezVous.find();

    return res.status(200).json({
        data: rdv
    });
});

// Récupérer un rendez-vous par ID
const mongoose = require('mongoose');

router.get('/rdv/:id', async (req, res) => {
    const { id } = req.params; 


    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: 'ID invalide'
        });
    }

    const rdv = await rendezVous.findById(id);

    if (!rdv) {
        return res.status(404).json({
            error: 'Rendez-vous non trouvé'
        });
    }

    return res.status(200).json({
        data: rdv
    });
});





// Liste des rendez vous de l'utilisateur
router.get('/utilisateur', [verifyToken, isUtilisateur], async (req, res) => {
    const rendezVous = await RendezVous.find().populate({
        path: "demande_rendez_vous",
        match: { utilisateur: req.utilisateurId },
        populate: ["vehicule", "type_rendez_vous"]
    })

    return res.status(200).json({
        data: rendezVous
    })
})

module.exports = router