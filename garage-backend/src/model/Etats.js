const EtatDemandeRendezVous = {
    ANNULER: -10,
    EN_COURS: 0,
    VALIDER: 10
}

const EtatRendezVous = {
    EN_ATTENTE: 0,
    ANNULER: -10,
    EN_COURS: 10,
    FINI: 20
}

module.exports = {
    EtatDemandeRendezVous,
    EtatRendezVous
}