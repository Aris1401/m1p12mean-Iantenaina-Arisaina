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

module.exports = {
    EtatDemandeRendezVous,
    EtatIntervention
}