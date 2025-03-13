const DemandeRendezVous = require('../model/RendezVous/demandeRendezVous')
const RendezVous = require('../model/RendezVous/rendezVous')

const { EtatDemandeRendezVous, EtatRendezVous } = require('../model/Etats')

class RendezVousService {
    // Valider demande rendez-vous
    static async validerDemandeRendezVous(idDemande) {
        const demandeRendezVous = await DemandeRendezVous.findOne({ _id: idDemande })

        // Verification si la demande des valide
        if (demandeRendezVous.etat_demande != EtatDemandeRendezVous.EN_COURS) {
            throw new Error("Une erreur est survenue")
        }

        // Creation de rendez-vous a partir de demande
        const rendezVous = new RendezVous({
            date_rendez_vous: demandeRendezVous.date_souhaiter,
            etat_rendez_vous: EtatRendezVous.EN_ATTENTE,
            demande_rendez_vous: demandeRendezVous._id
        })

        await rendezVous.save()

        // Mettre a jour l'etat de la demande en valider
        demandeRendezVous.etat_demande = EtatDemandeRendezVous.VALIDER
        await demandeRendezVous.save()
    }
}

module.exports = RendezVousService