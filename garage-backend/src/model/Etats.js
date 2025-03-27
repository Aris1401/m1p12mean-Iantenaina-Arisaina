const EtatDemandeRendezVous = {
    ANNULER: -10,
    EN_COURS: 0,
    VALIDER: 10
}

const EtatIntervention = {
    EN_ATTENTE: -10,
    EN_COURS: 0,
    EN_ATTENTE_DE_PIECE: 10,
    FINI:100,
}

const EtatRendezVous = {
    EN_ATTENTE: 0,
    ANNULER: -10,
    EN_COURS: 10,
    FINI: 20
}

const EtatDevis = {
    EN_ATTENTE: 0,
    VALIDER: 10,
    REFUSER: -10
}

module.exports = {
    EtatDemandeRendezVous,
    EtatIntervention,
    EtatRendezVous,
    EtatDevis
}