const express = require('express')
const router = express.Router()

const Facture = require('../model/Intervention/Facture/facture')

// Services
const FactureService = require('../services/factureService')

const { verifyToken } = require('../middlewares/jwt')

// Telecharger pdf facture
router.get('/:factureId/download', async (req, res) => {
    const { filename, path } = await FactureService.genererPDFFacture(req.params.factureId)

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return res.download(path)
})

// Telecharger pdf facture
router.get('/devis/:devisId/download', async (req, res) => {
    const { filename, path } = await FactureService.generatePDFDevis(req.params.devisId)

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return res.download(path)
})

// Liste des factures
router.get('/', [verifyToken],  async (req, res) => {
    const factures = await Facture.find().sort({ createdAt: -1 }).populate([
        {
            path: "intervention",
            populate: {
                path: "utilisateur",
                select: ["-mot_de_passe", "-documents"]
            }
        }
    ])

    return res.status(200).json({
        data: factures
    })
})

module.exports = router