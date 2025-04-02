// intervention.controller.js

const express = require('express');
const router = express.Router();

const Devis = require('../model/Intervention/Devis/devis')
const Facture = require('../model/Intervention/Facture/facture')
const Intervention = require('../model/Intervention/intervention')
const DemandeRendezVous = require('../model/RendezVous/demandeRendezVous');
const RendezVous = require('../model/RendezVous/rendezVous');  
const Utilisateur = require('../model/Utilisateur/utilisateur');
const Vehicule=require('../model/Vehicule/vehicule');
const AssignationIntervention = require('../model/Intervention/assignationIntervention')
const { verifyToken, isManager, isUtilisateur } = require('../middlewares/jwt')
// Services
const InterventionService = require('../services/interventionService')
const FactureService = require('../services/factureService')

// Etats
const { EtatIntervention, EtatDevis } = require('../model/Etats');
const TravauxFicheIntervention = require('../model/Intervention/FicheIntervention/travauxFicheIntervention');
const Piece = require('../model/Piece/piece');
const TypeIntervention = require('../model/Intervention/FicheIntervention/typeIntervention');
const TypeEvenement = require('../model/Intervention/FicheIntervention/typeEvenement');
const StockPiece = require('../model/Piece/stockPiece');
const DevisPiece = require('../model/Intervention/Devis/devisPiece');
const FicheIntervention = require('../model/Intervention/FicheIntervention/ficheIntervetion')


// Obtenir les interventions du jour
router.get('/', [verifyToken], async (req, res) => {
    const intervention = await Intervention.find({
        $or: [
                { etat_intervention: EtatIntervention.EN_COURS}, 
                { etat_intervention: EtatIntervention.EN_ATTENTE},
                { etat_intervention: EtatIntervention.EN_ATTENTE_DE_PIECE}
        ]
    }).populate([
        "vehicule",
        {
            path: "utilisateur",
            select: ["-mot_de_passe", "-documents"]
        },
        "facture",
        "devis"
    ]).sort({ createdAt: -1 })

    return res.status(200).json({
        data: intervention
    })
})

// Obtenir l'intervetion courante d'un vehicule
router.get('/vehicule/:vehiculeId/actif', [verifyToken], async (req, res) => {
    const interventions = await Intervention.find({ vehicule: req.params.vehiculeId, etat_intervention: EtatIntervention.EN_COURS }).populate("facture").populate("devis").sort({ createdAt: -1 }).limit(1)

    return res.status(200).json({
        data: interventions[0] ?? null
    })
})

// Obtenir la liste des intervetions d'un vehicule
router.get('/vehicule/:vehiculeId', [verifyToken], async (req, res) => {
    const interventions = await Intervention.find({ vehicule: req.params.vehiculeId }).populate("facture").populate("devis").sort({ createdAt: -1 })

    return res.status(200).json({
        data: interventions
    })
})

// Liste des mecaciens assigner
router.get('/:interventionId/mecaniciens', [verifyToken], async (req, res) => {
    const assignations = await AssignationIntervention.find({ intervention: req.params.interventionId }).populate(
        ["intervention", {
            path: "mecanicien",
            select: ["-documents", "-mot_de_passe"]
        }]
    )

    return res.status(200).json({
        data: assignations
    })
})

// Assigner mecanicien
router.post('/:interventionId/mecaniciens', [verifyToken], async (req, res) => {
    const idMecanicien = req.body.mecanicienId

    try {
        await InterventionService.assignerMecanicien(req.params.interventionId, idMecanicien)
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }

    return res.status(200).json({
        message: "Mecanicien assigner avec succes"
    })
})

// Desaffecter mecanicier 
router.delete('/:interventionId/mecaniciens/:mecanicienId', [verifyToken], async (req, res) => {
    const idMecanicien = req.params.mecanicienId

    await InterventionService.desaffecterMecanicien(req.params.interventionId, idMecanicien)

    return res.status(200).json({
        message: "Mecanicien desaffecter avec success"
    })
})

// Generer devis intervetion
router.post('/:inteventionId/devis', [verifyToken], async (req, res) => {
    try {
        await FactureService.genererDevis(req.params.inteventionId)        
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }

    return res.status(200).json({
        message: "Devis generer avec success"
    })
})

// Generer facture
router.post('/:interventionId/facture', [verifyToken], async (req, res) => {
    try {
        await FactureService.genererFacture(req.params.interventionId, req.body.observation)
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }

    return res.status(200).json({
        message: "Facture generer avec success"
    })
})

// Obtenir les details d'une intervention
router.get('/:interventionId', [verifyToken], async (req, res) => {
    const intervention = await Intervention.findOne({ _id: req.params.interventionId }).populate([
        { 
            path: 'fiche_intervention',
            populate: 'type_evenement'
        },
        {
            path: 'devis'
        },
        "facture",
        "vehicule",
        {
            path: "utilisateur",
            select: ["-mot_de_passe", "-documents"]
        }
    ])

    return res.status(200).json({
        data: intervention
    })
})

// Mettre a jour la date de debut des travaux
router.put('/:intervetionId/date-debut', [verifyToken], async (req, res) => {
    const intervention = await Intervention.findOne({ _id: req.params.intervetionId }).populate("devis")

    if (intervention.etat_intervention != EtatIntervention.EN_ATTENTE) {
        return res.status(400).json({
            error: "Une erreur s\'est produite"
        })
    }

    if (intervention.devis.etat != EtatDevis.VALIDER) {
        return res.status(400).json({
            error: 'Veuillez valider le devis'
        })
    }

    intervention.date_debut = req.body.selected
    // Mis a jour de l'etat de 'intervetion
    intervention.etat_intervention = EtatIntervention.EN_COURS
    await intervention.save()

    return res.status(200).json({
        message: "Date debut selectionner avec success"
    })
})

// Valider devis intevention
router.get('/:intervetionId/devis/valider', [verifyToken], async (req, res) => {
    const intervention = await Intervention.findOne({ _id: req.params.intervetionId })

    // Check etat intervetion
    if (intervention.etat_intervention != EtatIntervention.EN_ATTENTE) {
        return res.status(400).json({
            error: "Devis deja valider"
        })
    }

    // Obtenir devis
    const devis = await Devis.findOne({ _id: intervention.devis })

    if (devis.etat != EtatDevis.EN_ATTENTE) {
        return res.status(200).json({
            error: "Devis deja valider"
        })
    }

    devis.etat = EtatDevis.VALIDER
    await devis.save()

    return res.status(200).json({
        message: "Devis valider"
    })
})

// Refuser devis intevention
router.get('/:intervetionId/devis/refuser', [verifyToken], async (req, res) => {
    const intervention = await Intervention.findOne({ _id: req.params.intervetionId })

    // Check etat intervetion
    if (intervention.etat_intervention != EtatIntervention.EN_ATTENTE) {
        return res.status(400).json({
            error: "Devis deja refuser"
        })
    }

    // Obtenir devis
    const devis = await Devis.findOne({ _id: intervention.devis })

    if (devis.etat != EtatDevis.EN_ATTENTE) {
        return res.status(200).json({
            error: "Devis deja refuser"
        })
    }

    devis.etat = EtatDevis.REFUSER
    await devis.save()

    return res.status(200).json({
        message: "Devis valider"
    })
})

router.post('/new', async (req, res) => {
    const { idRdv } = req.body;

    try {
        const rdv = await RendezVous.findById(idRdv);

        if (!rdv) {
            return res.status(404).json({ message: 'Rendez-vous non trouvé' });
        }

        const demandeRdv = await DemandeRendezVous.findOne({
            _id: rdv.demande_rendez_vous,
            etat_demande: 10 
        });

        if (!demandeRdv) {
            return res.status(404).json({ message: 'Demande de rendez-vous non trouvée ou invalide' });
        }

        const utilisateur = await Utilisateur.findById(demandeRdv.utilisateur);
        const vehicule = await Vehicule.findById(demandeRdv.vehicule);
        
        if (!utilisateur || !vehicule) {
            return res.status(404).json({ message: 'Utilisateur ou véhicule non trouvé' });
        }

        const nouvelleIntervention = new Intervention({
            date_debut: new Date(),
            etat_intervention: 0, 
            fiche_intervention: null,
            devis: null,
            facture: null,
            vehicule: vehicule.id,
            utilisateur: utilisateur.id,
        });


        const intervention = await nouvelleIntervention.save();

        rdv.etat_rendez_vous = 20; 
        await rdv.save();

        const nouvelleFicheIntervention = new FicheIntervention({
            intervention: intervention._id, 
            description: null,               
            type_intervention: null,         
            type_evenement: null,           
            autre_evenement: null,          
            documents: []                
        });

        await nouvelleFicheIntervention.save();

        return res.status(201).json({
            message: 'Intervention créée avec succès et rendez-vous mis à jour',
            data: intervention
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur interne du serveur', error });
    }
});



router.get('/', async (req, res) => {
    try {
      const interventions = await Intervention.find()
        .populate('utilisateur')         
        .populate('vehicule')           
        .populate('fiche_intervention')   
        .populate('devis')                
        .populate('facture');            
      
      res.json({ data: interventions });
    } catch (error) {
      console.error('Erreur lors de la récupération des interventions:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  });

  router.post('/:id', async (req, res) => {
        const { id } = req.params;
        const pieces = await Piece.find();  
        const travaux = await TravauxFicheIntervention.find();  
        const typeInterventions = await TypeIntervention.find(); 
        const typeEvenements = await TypeEvenement.find(); 
        const travauxFicheIntervention = await TravauxFicheIntervention.find();

        const intervention = await Intervention.findById(id)
            .populate('utilisateur').populate('vehicule').populate('fiche_intervention').populate('devis').populate('facture');             
        if (!intervention) 
        {
            return res.status(404).json({ message: 'Intervention non trouvée' });
        }

        res.json({
            data: {
                intervention,
                pieces,
                travaux,
                typeInterventions,  
                typeEvenements,     
                travauxFicheIntervention,
            }
        });
});


router.get('/stock/:idPiece', async (req, res) => {
    try {
        const { idPiece } = req.params;

        const piece = await Piece.findById(idPiece);
        if (!piece) {
            return res.status(404).json({ message: 'Pièce non trouvée' });
        }

        const stockPieces = await StockPiece.find({ piece: piece._id });
        if (!stockPieces || stockPieces.length === 0) {
            return res.status(404).json({ message: 'Aucun stock associé à cette pièce' });
        }

        let totalEntree = 0;
        let totalSortie = 0;

        stockPieces.forEach(stockPiece => {
            totalEntree += stockPiece.entree;
            totalSortie += stockPiece.sortie;
        });

        const stockDispo = totalEntree - totalSortie;  
        console.log(stockDispo +piece.designation + totalEntree , totalSortie);

        const devisPiece = await DevisPiece.findOne({ piece: piece._id });
        // if (!devisPiece) {
        //     return res.status(404).json({ message: 'DevisPiece non trouvée' });
        // }

        res.status(200).json({
            piece: piece,
            stockDispo: stockDispo, 
            devisPiece: devisPiece,
        });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});



module.exports = router;
