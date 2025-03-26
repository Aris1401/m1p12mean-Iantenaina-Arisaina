const express = require("express");
const router = express.Router();

// Models
const Utilisateur = require("../model/Utilisateur/utilisateur");
const RoleUtilisateur = require("../model/Utilisateur/roleUtilisateur");
const AssignationIntervention = require('../model/Intervention/assignationIntervention')
const Intervention = require('../model/Intervention/intervention')
const Facture = require('../model/Intervention/Facture/facture')
const Devis = require('../model/Intervention/Devis/devis')

router.get("/", async (req, res) => {
  const utilisateurs = await Utilisateur.find()
    .select(["-mot_de_passe", "-documents"])
    .populate({ path: "roles", match: { role: "ROLE_MECANICIEN" } });

  return res.status(200).json({
    data: utilisateurs.filter((item) => item.roles.length != 0),
  });
});

router.get("/:id", async (req, res) => {
  let utilisateurs = await Utilisateur.findOne({ _id: req.params.id })
    .select(["-mot_de_passe", "-documents"])
    .populate({ path: "roles", match: { role: "ROLE_MECANICIEN" } });

  utilisateurs = utilisateurs.roles.length != 0 ? utilisateurs : null;

  if (!utilisateurs) {
    return res.status(400).json({
      error: "Une erreur est survenu",
    });
  }

  return res.status(200).json({
    data: utilisateurs,
  });
});

// Liste des intervetions de mecaniciens
router.get('/:id/interventions', async (req, res) => {
  const assignations = await AssignationIntervention.find({ mecanicien: req.params.id }).populate([{
    path: "intervention",
    populate: ["devis", "facture", "vehicule", {
      path: "utilisateur",
      select: ["-mot_de_passe", "-documents"] 
  }]
  }, {
    path: "mecanicien",
    select: ["-mot_de_passe", "-documents"]
  }])

  return res.status(200).json({
    data: assignations
  })
})

router.post("/", async (req, res) => {
  const roleUtilisateur = await RoleUtilisateur.findOne({
    role: "ROLE_MECANICIEN",
  });

  const { nom, prenom, email, adresse, date_naissance, telephone } = req.body;

  const mot_de_passe = "default";

  const utilisateur = new Utilisateur({
    nom: nom,
    prenom: prenom,
    email: email,
    mot_de_passe: mot_de_passe,
    adresse: adresse,
    date_naissance: date_naissance,
    telephone: telephone,
    roles: [roleUtilisateur._id],
  });

  const error = utilisateur.validateSync();

  if (error) {
    res.status(400).send({ error: error.errors });
  } else {
    await utilisateur.save();

    res.status(201).send({ message: "Mecanicien enregistrer avec succès !" });
  }
});

module.exports = router;
