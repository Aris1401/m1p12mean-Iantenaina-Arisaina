const express = require('express')
const router = express.Router()

// Modèle
const FicheIntervention = require('../model/Intervention/FicheIntervention/ficheIntervetion')
const PieceFicheIntervention = require('../model/Intervention/FicheIntervention/pieceFicheIntervention')
const TravauxFicheIntervention = require('../model/Intervention/FicheIntervention/travauxFicheIntervention')
const Intervention = require('../model/Intervention/intervention')

const TypeEvenement = require('../model/Intervention/FicheIntervention/typeEvenement')
const TypeIntervention = require('../model/Intervention/FicheIntervention/typeIntervention')

// Middelwares
const { verifyToken } = require('../middlewares/jwt')
const StockPiece = require('../model/Piece/stockPiece')


// Obtenir fiche intervention
router.get('/:ficheId', [verifyToken], async (req, res) => {
    const ficheIntervention = await FicheIntervention.findOne({ _id: req.params.ficheId }).populate("type_evenement").populate('type_intervention')

    return res.status(200).json({
        data: ficheIntervention
    })
})

// Obtenir les travaux d'une fiche d'intervention
router.get('/:ficheId/travaux', [verifyToken], async (req, res) => {
    const travaux = await TravauxFicheIntervention.find({ fiche_intervention: req.params.ficheId })

    return res.status(200).json({
        data: travaux
    })
})

// Obtenir les travaux d'une fiche d'intervention
router.get('/:ficheId/pieces', [verifyToken], async (req, res) => {
    const travaux = await PieceFicheIntervention.find({ fiche_intervention: req.params.ficheId }).populate('piece')

    return res.status(200).json({
        data: travaux
    })
})

// 1. Lire toutes les fiches d'intervention
router.get('/', async (req, res) => {
    try {
        const fiches = await FicheIntervention.find()
            .populate('intervention') 
            .populate('type_intervention') 
            .populate('type_evenement');  

        return res.status(200).json({
            data: fiches
        })
    } catch (error) {
        return res.status(500).json({
            error: 'Erreur lors de la récupération des fiches d\'intervention',
            message: error.message
        })
    }
})

// 2. Lire une fiche d'intervention par son ID
router.get('/:id', async (req, res) => {
    try {
        const fiche = await FicheIntervention.findById(req.params.id)
            .populate('intervention')
            .populate('type_intervention')
            .populate('type_evenement');

        if (!fiche) {
            return res.status(404).json({
                error: 'Fiche d\'intervention non trouvée'
            })
        }

        return res.status(200).json({
            data: fiche
        })
    } catch (error) {
        return res.status(500).json({
            error: 'Erreur lors de la récupération de la fiche d\'intervention',
            message: error.message
        })
    }
})

// 3. Créer une nouvelle fiche d'intervention
router.post('/', [verifyToken], async (req, res) => {
        const fiche = new FicheIntervention({
            description: req.body.description,
            type_intervention: req.body.type_intervention,
            type_evenement: req.body.type_evenement,
            autre_evenement: req.body.autre_evenement,
            documents: req.body.documents,
            intervention: req.body.intervention,
        })

        const errors = fiche.validateSync()

        if (errors) {
            return res.status(400).json({
                error: 'Veuillez vérifier les entrées',
                data: errors.errors
            })
        }

        await fiche.save()

        return res.status(201).json({
            message: 'Fiche d\'intervention enregistrée avec succès',
            data: fiche
        })

})

// 4. Mettre à jour une fiche d'intervention
router.put('/:id', [verifyToken], async (req, res) => {
        const fiche = await FicheIntervention.findByIdAndUpdate(
            req.params.id,
            {
                description: req.body.description,
                type_intervention: req.body.type_intervention,
                type_evenement: req.body.type_evenement,
                autre_evenement: req.body.autre_evenement,
                documents: req.body.documents,
                intervention: req.body.intervention,
            },
            { new: true }
        )

        if (!fiche) 
        {
            return res.status(404).json({
                error: 'Fiche d\'intervention non trouvée'
            })
        }

        return res.status(200).json({
            message: 'Fiche d\'intervention mise à jour avec succès',
            data: fiche
        })
})

// 5. Supprimer une fiche d'intervention
router.delete('/:id', [verifyToken], async (req, res) => {
    try {
        const fiche = await FicheIntervention.findByIdAndDelete(req.params.id)

        if (!fiche) {
            return res.status(404).json({
                error: 'Fiche d\'intervention non trouvée'
            })
        }

        return res.status(200).json({
            message: 'Fiche d\'intervention supprimée avec succès'
        })
    } catch (error) {
        return res.status(500).json({
            error: 'Erreur lors de la suppression de la fiche d\'intervention',
            message: error.message
        })
    }
});

//modification fiche-intervention
router.put('/update-save/:id', [verifyToken], async (req, res) => {
    const { description, type_intervention, type_evenement, autre_evenement, documents, pieces, travaux, etat_intervention } = req.body;

    if (!description || !type_intervention || !type_evenement) {
        return res.status(400).json({ success: false, message: 'Les champs obligatoires sont manquants' });
    }

    if (type_evenement === 'autre' && !autre_evenement) {
        return res.status(400).json({ success: false, message: 'Le champ autre_evenement est obligatoire lorsque le type_evenement est "autre"' });
    }

    let ficheIntervention = await FicheIntervention.findOne({ 'intervention': req.params.id });

    if (!ficheIntervention) {
        ficheIntervention = new FicheIntervention();
        await ficheIntervention.save({ validateBeforeSave: false });

        const intervention = await Intervention.findOne({ _id: req.params.id })
        intervention.fiche_intervention = ficheIntervention._id

        await intervention.save({ validateBeforeSave: false })

        // Mettre a jour fiche intervention
        ficheIntervention.intervention = intervention._id
        await ficheIntervention.save()
    }

    ficheIntervention.description = description || ficheIntervention.description;
    ficheIntervention.type_intervention = type_intervention || ficheIntervention.type_intervention;

    if (type_evenement === 'autre') {
        ficheIntervention.type_evenement = null;
        ficheIntervention.autre_evenement = autre_evenement || ficheIntervention.autre_evenement;
    } else {
        ficheIntervention.type_evenement = type_evenement || ficheIntervention.type_evenement;
        ficheIntervention.autre_evenement = null;
    }

    ficheIntervention.documents = documents || ficheIntervention.documents;

    const updatedFiche = await ficheIntervention.save();

    const piecePromises = pieces && pieces.length > 0 ? pieces.map(piece => {
        let etatPiece = 0;

        switch (piece.statut) {
            case 'En rupture':
                etatPiece = 0;
                break;
            case 'En stock':
                etatPiece = 20;
                const stockPieceData = {
                    fiche_intervention: updatedFiche._id,
                    piece: piece.selectedPiece,
                    date_mouvement: new Date(),
                    entree: 0,
                    sortie: piece.quantity,
                    prix_unitaire: 0
                };

                const stockPiece = new StockPiece(stockPieceData);
                stockPiece.save()
                    .then(() => console.log("Stock mis à jour avec succès"))
                    .catch(error => console.error("Erreur lors de l'insertion dans StockPiece:", error));
                break;
            default:
                break;
        }

        return new PieceFicheIntervention({
            fiche_intervention: updatedFiche._id,
            piece: piece.selectedPiece,
            quantite: piece.quantity,
            prix_unitaire: piece.prixUnitaire,
            prix_ht: piece.prixUnitaire * piece.quantity,
            etat_intervention: etatPiece,
        }).save();
    }) : [];

    const travauxPromises = travaux && travaux.length > 0 ? travaux.map(async (travail) => {
        const existingTravail = await TravauxFicheIntervention.findOne({ fiche_intervention: updatedFiche._id, designation: travail.designation });

        if (existingTravail) {
            existingTravail.quantite = travail.quantite || existingTravail.quantite;
            existingTravail.prix_unitaire = travail.prixUnitaire || existingTravail.prix_unitaire;
            existingTravail.prix_ht = travail.prixHT || existingTravail.prix_ht;
            existingTravail.etat_intervention = travail.etat_intervention || existingTravail.etat_intervention;

            await existingTravail.save();
        } else {
            await new TravauxFicheIntervention({
                fiche_intervention: updatedFiche._id,
                designation: travail.designation,
                quantite: travail.quantite,
                prix_unitaire: travail.prixUnitaire,
                prix_ht: travail.prixHT,
                etat_intervention: travail.etat_intervention || etat_intervention || 0,
            }).save();
        }
    }) : [];

    await Promise.all([...piecePromises, ...travauxPromises]);

    res.status(200).json({ success: true, message: 'Fiche d\'intervention mise à jour et enregistrée avec succès', data: updatedFiche });
});




module.exports = router
