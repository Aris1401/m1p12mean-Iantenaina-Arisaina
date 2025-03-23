// intervention.controller.js

const express = require('express');
const router = express.Router();

const TravauxFicheIntervention = require('../model/Intervention/FicheIntervention/travauxFicheIntervention')
const PieceFicheIntervention = require('../model/Intervention/FicheIntervention/pieceFicheIntervention')
const TypeEvenement = require('../model/Intervention/FicheIntervention/typeEvenement')
const FicheIntervention = require('../model/Intervention/FicheIntervention/ficheIntervetion')
const Intervention = require('../model/Intervention/intervention');
const DemandeRendezVous = require('../model/RendezVous/demandeRendezVous');
const RendezVous = require('../model/RendezVous/rendezVous');  
const Utilisateur = require('../model/Utilisateur/utilisateur');
const Vehicule=require('../model/Vehicule/vehicule');

// Etats
const { EtatIntervention } = require('../model/Etats')

const { verifyToken } = require('../middlewares/jwt');

// Obtenir l'intervetion courante d'un vehicule
router.get('/vehicule/:vehiculeId/actif', [verifyToken], async (req, res) => {
    const interventions = await Intervention.find({ vehicule: req.params.vehiculeId, etat_intervention: EtatIntervention.EN_COURS }).sort({ createdAt: -1 }).limit(1)

    return res.status(200).json({
        data: interventions[0] ?? null
    })
})

// Obtenir la liste des intervetions d'un vehicule
router.get('/vehicule/:vehiculeId', [verifyToken], async (req, res) => {
    const interventions = await Intervention.find({ vehicule: req.params.vehiculeId }).sort({ createdAt: -1 })

    return res.status(200).json({
        data: interventions
    })
})

// Obtenir les details d'une intervention
router.get('/:interventionId', [verifyToken], async (req, res) => {
    const intervention = await Intervention.findOne({ _id: req.params.interventionId }).populate([
        { 
            path: 'fiche_intervention',
            populate: 'type_evenement'
        }
    ])

    return res.status(200).json({
        data: intervention
    })
})

router.post('/new', async (req, res) => {
    const { idRdv } = req.body;
  
   const rdv = await RendezVous.findById(idRdv);
   const demandeRdv = await DemandeRendezVous.findOne({
    _id: rdv.demande_rendez_vous,
    etat_demande: 10 
    });
    const utilisateur = await Utilisateur.findById(demandeRdv.utilisateur);
    const vehicule = await Vehicule.findById(demandeRdv.vehicule);
    console.log(vehicule.id)

    const nouvelleIntervention = new Intervention({
        date_debut: new Date(), 
        etat_intervention: 0,   
        fiche_intervention: null,  
        devis: null,              
        facture: null,            
        vehicule: vehicule.id,  
        utilisateur: utilisateur.id,  
    });

  
    await nouvelleIntervention.save();
    return res.status(201).json({
        message: 'Intervention créée avec succès',
        data: nouvelleIntervention
    });
});

module.exports = router;
