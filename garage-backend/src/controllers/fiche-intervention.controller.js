const express = require('express')
const router = express.Router()

// Modèle
const FicheIntervention = require('../model/Intervention/FicheIntervention/ficheIntervetion')
const PieceFicheIntervention = require('../model/Intervention/FicheIntervention/pieceFicheIntervention')
const TravauxFicheIntervention = require('../model/Intervention/FicheIntervention/travauxFicheIntervention')

// Middelwares
const { verifyToken } = require('../middlewares/jwt')


// Obtenir fiche intervention
router.get('/:ficheId', [verifyToken], async (req, res) => {
    const ficheIntervention = await FicheIntervention.findOne({ _id: req.params.ficheId })

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
            .populate('intervention')  // Populate l'objet intervention référencé
            .populate('type_intervention')  // Populate le type_intervention si nécessaire
            .populate('type_evenement');  // Populate le type_evenement si nécessaire

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
    try {
        const fiche = new FicheIntervention({
            description: req.body.description,
            type_intervention: req.body.type_intervention,
            type_evenement: req.body.type_evenement,
            autre_evenement: req.body.autre_evenement,
            documents: req.body.documents,  // Si des documents sont envoyés
            intervention: req.body.intervention,  // Lien vers l'intervention existante
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
    } catch (error) {
        return res.status(500).json({
            error: 'Erreur lors de l\'ajout de la fiche d\'intervention',
            message: error.message
        })
    }
})

// 4. Mettre à jour une fiche d'intervention
router.put('/:id', [verifyToken], async (req, res) => {
    try {
        const fiche = await FicheIntervention.findByIdAndUpdate(
            req.params.id,
            {
                description: req.body.description,
                type_intervention: req.body.type_intervention,
                type_evenement: req.body.type_evenement,
                autre_evenement: req.body.autre_evenement,
                documents: req.body.documents,
                intervention: req.body.intervention,  // Mise à jour de l'intervention associée
            },
            { new: true }  // Pour retourner le document mis à jour
        )

        if (!fiche) {
            return res.status(404).json({
                error: 'Fiche d\'intervention non trouvée'
            })
        }

        return res.status(200).json({
            message: 'Fiche d\'intervention mise à jour avec succès',
            data: fiche
        })
    } catch (error) {
        return res.status(500).json({
            error: 'Erreur lors de la mise à jour de la fiche d\'intervention',
            message: error.message
        })
    }
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
})

module.exports = router
