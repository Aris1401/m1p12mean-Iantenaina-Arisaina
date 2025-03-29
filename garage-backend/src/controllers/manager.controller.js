const express = require("express");
const router = express.Router();

const RendezVous = require("../model/RendezVous/rendezVous");
const { EtatRendezVous } = require('../model/Etats')

// Services
const StatistiquesManager = require("../services/statistiquesManagerService");

const { verifyToken, isManager } = require("../middlewares/jwt");

// Tableau de bord manager
router.get("/stats/mois", [verifyToken, isManager], async (req, res) => {
    const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    return res.status(200).send({
      data: mois,
    });
  });

router.get('/stats/annees', [verifyToken, isManager], async (req, res) => {
    const annees = await StatistiquesManager.getRendezVousYears();

    return res.status(200).send({
        data: annees
    });
});

// Nombre des rendez-vous du jour
router.get("/stats/rendez-vous", [verifyToken, isManager], async (req, res) => {
  const rendezVousFini = await StatistiquesManager.getRendezVousCountByYearAndMonth(new Date().getFullYear(), EtatRendezVous.FINI);
  const rendezVousEnAttente = await StatistiquesManager.getRendezVousCountByYearAndMonth(new Date().getFullYear(), EtatRendezVous.EN_ATTENTE);


  return res.status(200).send({
    data: {
        fini: rendezVousFini,
        en_attente: rendezVousEnAttente
    },
  });
});

router.get('/stats/rendez-vous/total', [verifyToken, isManager], async (req, res) => {
  const nombreRendezVous = await StatistiquesManager.getNombreRendezVous()

  return res.status(200).json({
    data: nombreRendezVous
  })
})

// Obtenir le total des factures d'une annee
router.get('/stats/facture/total/annee/:annee', async (req, res) => {
  const annee = req.params.annee ?? new Date().getFullYear()

  const totalFacture = await StatistiquesManager.getTotalFacturesAnnee(annee)

  return res.status(200).json({
    data: totalFacture
  })
})

// Obtenir le total des factures du jour
router.get('/stats/facture/total', async (req, res) => {
  const totalFacture = await StatistiquesManager.getTotalFacturesJour()

  return res.status(200).json({
    data: totalFacture
  })
})


// Nombre de demande de rendez-vous
router.get('/stats/demande-rendez-vous/total', [verifyToken], async (req, res) => {
  const nombreDemandeRendezVous = await StatistiquesManager.getNombreDemandeRendezVous()

  return res.status(200).json({
    data: nombreDemandeRendezVous
  })
})

module.exports = router;
