const express = require('express')
const router = express.Router()

// Modeles
const Piece = require('../model/Piece/piece')
const StockPiece = require('../model/Piece/stockPiece')

const PieceFicheIntervention = require('../model/Intervention/FicheIntervention/pieceFicheIntervention')

const PieceService = require('../services/pieceService')

const { verifyToken, isManager } = require('../middlewares/jwt')

// Obtenir toutes les pieces
router.get('/', async (req, res) => {
    const pieces = await Piece.find()

    return res.status(200).json({
        data: pieces
    })
})

router.put('/', [verifyToken, isManager], async (req, res) => {
    const piece = await Piece.findById(req.body.id)
    if (!piece) {
        return res.status(404).json({
            message: "Piece not found"
        })
    }

    piece.designation = req.body.designation
    piece.reference = req.body.reference

    const errors = piece.validateSync()
    if (errors) {
        return res.status(400).json({
            error: "Veuillez vérifier les champs",
            data: errors.errors
        })
    }

    await piece.save()

    return res.status(200).json({
        data: piece,
        message: "Piece modifiée avec succès"
    })
})

// Ajouter en stock
router.post('/', [verifyToken], async (req, res) => {
    const piece = new Piece({
        designation: req.body.designation,
        reference: req.body.reference
    })

    if (req.body.piece) {
        piece._id = req.body.piece
    }

    let messages = [
        'Piece ajouter en stock avec succes'
    ]

    try {
        let ajoutMessages = await PieceService.ajouterEnStock(
            piece,
            req.body.quantite,
            req.body.prix,
            req.body.dateMouvement
        )

        messages = [...messages, ...ajoutMessages]
    } catch (error) {
        return res.status(400).json({
            error: error.message,
            data: error.errors
        })
    }

    return res.status(200).json({
        message: messages
    })
})

// Obtenir l'etat de stock
// Mouvement de stock
router.get('/mouvement/:id', async (req, res) => {
    const mouvementPiece = await StockPiece.find({ piece: req.params.id }).populate('piece').sort({ date_mouvement: -1 })

    return res.status(200).json({
        data: mouvementPiece
    })
})

router.get('/stock', async (req, res) => {
    const etatDeStock = await PieceService.obtenirEtatStock()

    return res.status(200).json({
        data: etatDeStock
    })
})

// Obteinr les interventions necessaitant des pieces
router.get('/interventions', async (req, res) => {
    const piecesFicheIntervention = await PieceFicheIntervention.find({ etat_intervention: 0 }).populate(
        [
            "fiche_intervention",
            "piece"
        ]).sort({ createdAt: 1 })

    return res.status(200).json({
        data: piecesFicheIntervention
    })
})


// app.get('/pieces', async (req, res) => {
//     try {
//       const pieces = await Piece.find();
//       res.status(200).json(pieces);
//     } catch (error) {
//       res.status(500).send('Erreur serveur lors de la récupération des pièces');
//     }
//   });
  
//   app.get('/travaux', async (req, res) => {
//     try {
//       const travaux = ['Travail 1', 'Travail 2', 'Travail 3']; 
//       res.status(200).json(travaux);
//     } catch (error) {
//       res.status(500).send('Erreur serveur lors de la récupération des travaux');
//     }
//   });
  

module.exports = router