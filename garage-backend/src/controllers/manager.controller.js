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

module.exports = router;
