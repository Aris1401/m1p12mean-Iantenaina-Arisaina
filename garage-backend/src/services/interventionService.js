const AssignationIntervention = require('../model/Intervention/assignationIntervention')
const TypeRendezVous = require('../model/RendezVous/typeRendezVous')
const DemandeRendezVous = require('../model/RendezVous/demandeRendezVous')
const RendezVous = require('../model/RendezVous/rendezVous')
const Intervetion = require('../model/Intervention/intervention')

// Etats
const { EtatIntervention, EtatRendezVous, EtatDemandeRendezVous } = require('../model/Etats')

class InterventionService {
    static async creerIntervention(idRendezVous) {
        const rendezVous = await RendezVous.findOne({ _id: idRendezVous }).populate("demande_rendez_vous")

        if (rendezVous.etat_rendez_vous != EtatRendezVous.EN_ATTENTE || rendezVous.demande_rendez_vous.etat_demande != EtatDemandeRendezVous.VALIDER ) {
            throw new Error("Une erreur s\'est produite")
        }

        const intervention = new Intervetion({
            etat_intervention: EtatIntervention.EN_ATTENTE,
            vehicule: rendezVous.demande_rendez_vous?.vehicule,
            utilisateur: rendezVous.demande_rendez_vous?.utilisateur,
            devis: null,
            facture: null,
            fiche_intervention: null,
            date_debut: null
        })

        await intervention.save()

        // Assigner intervetion a la demande
        const demandeRendezVous = await DemandeRendezVous.findOne({ _id: rendezVous.demande_rendez_vous._id })
        demandeRendezVous.intervention = intervention._id

        await demandeRendezVous.save()

        return intervention
    }

    static async assignerMecanicien(idIntervention, idMecanicien) {
        // Verifier si le mecanicien a deja ete assigner
        const assignationCheck = await AssignationIntervention.findOne({ mecanicien: idMecanicien, intervention: idIntervention })
        if (assignationCheck) {
            throw new Error("Mecanicien deja assigner")
        }

        // Assigner mecanicien
        const assignation = new AssignationIntervention({
            mecanicien: idMecanicien,
            intervention: idIntervention
        })
        
        await assignation.save()
    }
}

module.exports = InterventionService