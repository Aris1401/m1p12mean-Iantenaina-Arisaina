const express = require('express')
const router = express.Router()

// Services
const FactureService = require('../services/factureService')

// Telecharger pdf facture
router.get('/:factureId/download', async (req, res) => {
    const { filename, stream } = await FactureService.genererPDFFacture(req.params.factureId)

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return res.download(stream.path)
})

// Telecharger pdf facture
router.get('/devis/:devisId/download', async (req, res) => {
    const { filename, stream } = await FactureService.generatePDFDevis(req.params.devisId)

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return res.download(stream.path)
})

module.exports = router