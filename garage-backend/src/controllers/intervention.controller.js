// intervention.controller.js

const express = require('express');
const router = express.Router();


const Intervention = require('../model/Intervention/intervention');
const DemandeRendezVous = require('../model/RendezVous/demandeRendezVous');
const RendezVous = require('../model/RendezVous/rendezVous');  
const Utilisateur = require('../model/Utilisateur/utilisateur');
const Vehicule=require('../model/Vehicule/vehicule');



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
