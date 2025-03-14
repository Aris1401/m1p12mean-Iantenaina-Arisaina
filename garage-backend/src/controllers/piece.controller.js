const express = require('express')
const router = express.Router()

// Modeles
const Piece = require('../model/Piece/piece')

const PieceService = require('../services/pieceService')

const { verifyToken } = require('../middlewares/jwt')

// Obtenir toutes les pieces
router.get('/', async (req, res) => {
    const pieces = await Piece.find()

    return res.status(200).json({
        data: pieces
    })
})

// Ajouter en stock
router.post('/', [verifyToken], async (req, res) => {
    const piece = new Piece({
        designation: req.body.designation,
        reference: req.body.reference
    })

    if (req.body.idPiece) {
        piece._id = idPiece
    }

    await PieceService.ajouterEnStock(
        piece,
        req.body.entree,
        req.body.prixUnitaire,
        req.body.dateMouvement
    )

    return res.status(200).json({
        message: "Piece ajouter en stock avec succes"
    })
})

// Obtenir l'etat de stock
router.get('/stock', async (req, res) => {
    const etatDeStock = await PieceService.obtenirEtatStock()

    return res.status(200).json({
        data: etatDeStock
    })
})

module.exports = router