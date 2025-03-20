const express = require('express')
const router = express.Router()
// Modeles
const TypeRendezVous = require('../model/RendezVous/typeRendezVous')
const DemandeRendezVous = require('../model/RendezVous/demandeRendezVous')

const { EtatDemandeRendezVous } = require('../model/Etats')

const { verifyToken } = require('../middlewares/jwt')
const rendezVous = require('../model/RendezVous/rendezVous')

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





module.exports = router