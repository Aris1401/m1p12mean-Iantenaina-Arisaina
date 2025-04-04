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

const { verifyToken, isManager, isUtilisateur, isMecanicien } = require('../middlewares/jwt')

// Services
const InterventionService = require('../services/interventionService')
const FactureService = require('../services/factureService')
const PieceService = require('../services/pieceService')

// Etats
const { EtatIntervention, EtatDevis, EtatDemandeRendezVous } = require('../model/Etats');
const TravauxFicheIntervention = require('../model/Intervention/FicheIntervention/travauxFicheIntervention');
const Piece = require('../model/Piece/piece');
const TypeIntervention = require('../model/Intervention/FicheIntervention/typeIntervention');
const TypeEvenement = require('../model/Intervention/FicheIntervention/typeEvenement');
const StockPiece = require('../model/Piece/stockPiece');
const DevisPiece = require('../model/Intervention/Devis/devisPiece');
const FicheIntervention = require('../model/Intervention/FicheIntervention/ficheIntervetion');
const PieceFicheIntervention = require('../model/Intervention/FicheIntervention/pieceFicheIntervention');


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

router.post('/new', [verifyToken, isMecanicien], async (req, res) => {
    const { idRdv } = req.body;

    try {
        const intervention = await InterventionService.creerIntervention(idRdv)

        await InterventionService.assignerMecanicien(intervention._id, req.utilisateurId)

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
        .populate('facture')
        .sort({ createdAt: -1 });            
      
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
        const ficheIntervention = await FicheIntervention.findOne({ intervention: id })
        .populate('type_intervention')
        .populate('type_evenement'); 
      
            console.log('ID de l\'intervention :', id);

        
            const travauxFicheInterventionByFiche = await TravauxFicheIntervention.find({ fiche_intervention: ficheIntervention._id }) || [];

            const pieceFicheInterventionByFiche = await PieceFicheIntervention.find({ fiche_intervention: ficheIntervention._id })
            .populate('piece')
            || [];
            console.log(pieceFicheInterventionByFiche);
          
          
        console.log(travauxFicheInterventionByFiche);

        res.json({
            data: {
                intervention,
                pieces,
                travaux,
                typeInterventions,  
                typeEvenements,     
                travauxFicheIntervention,
                ficheIntervention,
                travauxFicheInterventionByFiche,
                pieceFicheInterventionByFiche
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

        let devisPiece = await DevisPiece.findOne({ piece: piece._id });
        // if (!devisPiece) {
        //     return res.status(404).json({ message: 'DevisPiece non trouvée' });
        // }

        if (!devisPiece) {
            devisPiece = new DevisPiece()
        }

        devisPiece.prix_unitaire = (await PieceService.obtenirEtatStockPiece(idPiece)).prix_cump

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

router.put('/setEtatFini/:interventionId', async (req, res) => {
    const { interventionId } = req.params; 
  
    try {
        const intervention = await Intervention.findOne({ _id: interventionId }).populate("devis")

        if (intervention.etat_intervention != EtatIntervention.EN_COURS) {
            return res.status(400).json({
                message: "Impossible de valider l'intervention pour le moment"
            })
        }

        if (!intervention.devis) {
            return res.status(400).json({
                message: "Aucun devis assigner"
            })
        }

        if (intervention.devis && intervention.devis.etat != EtatDevis.VALIDER) {
            return res.status(400).json({
                message: "En attente de validation de devis"
            })
        }

        if (intervention.fiche_intervention) {
            const travaux = await TravauxFicheIntervention.find({ fiche_intervention: intervention.fiche_intervention })

            const allValid = travaux.every((travail) => {
                return travail.etat_intervention == 100
            })

            if (!allValid) {
                return res.status(400).json({
                    message: "Certains travaux ne sont pas encore marquer comme fini"
                })
            }
        }

      const updatedIntervention = await Intervention.findByIdAndUpdate(
        interventionId,
        { etat_intervention: EtatIntervention.FINI },
        { new: true }
      );

      if (!updatedIntervention) {
        return res.status(404).json({ message: 'Intervention non trouvée.' });
      }
  
      return res.status(200).json({
        message: 'L\'intervention a été mise à jour avec l\'état "FINI".',
        intervention: updatedIntervention
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
    }
  });

module.exports = router;
