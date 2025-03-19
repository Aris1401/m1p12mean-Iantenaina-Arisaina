const express = require('express')
const router = express.Router()

// Modeles
const TypeRendezVous = require('../model/RendezVous/typeRendezVous')
const DemandeRendezVous = require('../model/RendezVous/demandeRendezVous')
const RendezVous = require('../model/RendezVous/rendezVous')

const { EtatDemandeRendezVous, EtatRendezVous } = require('../model/Etats')

const { verifyToken, isManager, isUtilisateur } = require('../middlewares/jwt')

// Services
const RendezVousService = require('../services/rendezVousService')

// Types de rendez-vous
router.get('/types', async (req, res) => {
    const types = await TypeRendezVous.find()

    return res.status(200).json({
        data: types
    })
})

// Liste de tout les demandes
router.get('/demandes', [verifyToken], async (req, res) => {
    const demandes = await DemandeRendezVous.find({
        utilisateur: req.utilisateurId,
        etat_demande: { $ne: EtatDemandeRendezVous.ANNULER }
    }).populate('vehicule').populate('type_rendez_vous').sort({ date_souhaiter: -1 });

    return res.status(200).json({
        data: demandes
    })
})

// Liste de tout les rendez-vous
router.get('/manager', [verifyToken, isManager], async (req, res) => {
    const rendezVous = await RendezVous.find().populate({
        path: "demande_rendez_vous",
        populate: ["vehicule", "type_rendez_vous", {
            path: "utilisateur",
            select: ["-mot_de_passe"]
        }]
    }).sort({ date_rendez_vous: -1 })

    return res.status(200).json({
        data: rendezVous
    })
})

// Validation de demande rendez vous
router.put('/demandes/:id/valider', [verifyToken, isManager], async (req, res) => {
    try {
        await RendezVousService.validerDemandeRendezVous(req.params.id)
    } catch (err) {
        return res.status(400).json({
            error: err.message
        })
    }

    return res.status(200).json({
        message: "Demande de rendez-vous valider avec success"
    })
})

router.delete('/demandes/:id/annuler', [verifyToken], async (req, res) => {
    const demandeRendezVous = await DemandeRendezVous.findOne({ _id: req.params.id, utilisateur: req.utilisateurId, etat_demande: EtatDemandeRendezVous.EN_COURS })

    if (!demandeRendezVous) {
        return res.status(400).json({
            error: "Une erreur est survenue"
        })
    }

    demandeRendezVous.etat_demande = EtatDemandeRendezVous.ANNULER
    demandeRendezVous.save()

    return res.status(200).json({
        message: "Demande annuler avec succes"
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

    // Valider l'heure de demande de rendez-vous
    const isValid = await RendezVousService.verifierHeureDemandeRendezVous(demande)

    if (!isValid) {
        return res.status(400).json({
            error: "Heure deja reserver"
        })
    }

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

// Obtenir tout les demandes de rendez-vous
router.get('/demandes/manager', [verifyToken, isManager], async (req, res) => {
    const demandes = await DemandeRendezVous.find({ etat_demande: EtatDemandeRendezVous.EN_COURS }).populate('vehicule').populate('type_rendez_vous').populate({
        path: "utilisateur",
        select: ["-mot_de_passe"]
    }).sort({ date_souhaiter: -1 })

    return res.status(200).json({
        data: demandes
    })
});

// Liste des rendez vous de l'utilisateur
router.get('/utilisateur', [verifyToken, isUtilisateur], async (req, res) => {
    const rendezVous = await RendezVous.find({
        etat_rendez_vous: { $ne: EtatRendezVous.ANNULER }
    }).populate({
        path: "demande_rendez_vous",
        match: { utilisateur: { $eq: req.utilisateurId }},
        populate: ["vehicule", "type_rendez_vous"],
    })

    return res.status(200).json({
        data: rendezVous.filter(item => item.demande_rendez_vous != null)
    })
})

// Annulation de rendez-vous
router.delete('/:id/annuler', [verifyToken], async (req, res) => {
    let rendezVous = await RendezVous.findOne({ 
        _id: req.params.id, 
        etat_rendez_vous: EtatRendezVous.EN_ATTENTE 
    }).populate({
        path: "demande_rendez_vous",
        match: { utilisateur: req.utilisateurId }
    })

    rendezVous = rendezVous.demande_rendez_vous ? rendezVous : null

    if (!rendezVous) {
        return res.status(400).json({
            error: "Une erreur est survenue"
        })
    }

    rendezVous.etat_rendez_vous = EtatRendezVous.ANNULER
    rendezVous.save()

    return res.status(200).json({
        message: "Demande annuler avec succes"
    })
})

// Obtnir les indisponibiles
router.get('/indisponibilite', async (req, res) => {
    return res.status(200).json({
        data: await RendezVousService.obtenirHeuresIndisponibles()
    })
})

module.exports = router