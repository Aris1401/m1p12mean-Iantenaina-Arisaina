const Intervetion = require('../model/Intervention/intervention')
const FicheIntervention = require('../model/Intervention/FicheIntervention/ficheIntervetion')
const PieceFicheIntervention = require('../model/Intervention/FicheIntervention/pieceFicheIntervention')
const TravauxFicheIntervention = require('../model/Intervention/FicheIntervention/travauxFicheIntervention')

const Devis = require('../model/Intervention/Devis/devis')
const DevisPiece = require('../model/Intervention/Devis/devisPiece')
const DevisTravaux = require('../model/Intervention/Devis/devisTravaux')

const Facture = require('../model/Intervention/Facture/facture')
const FacturePiece = require('../model/Intervention/Facture/facturePiece')
const FactureTravaux = require('../model/Intervention/Facture/factureTravaux')

const { EtatDevis, EtatIntervention } = require('../model/Etats')

class FactureService {
    // Generer un devis
    static async genererDevis(idIntervetion) {
        // Obtenir intervention
        const intervention = await Intervetion.findOne({ _id: idIntervetion })

        if (!intervention.fiche_intervention) throw new Error("Impossible de generer un devis")

        if (intervention.devis) {
            const devisIntervetion = await Devis.findOne({ _id: intervention.devis })

            if (devisIntervetion.etat == EtatDevis.VALIDER) 
                throw new Error("Possede deja un devis valider")
        }

        const ficheIntervention = await FicheIntervention.findOne({ _id: intervention.fiche_intervention })
        
        // Obtenir les details de la fiche d'intervention
        const piecesIntervention = await PieceFicheIntervention.find({ fiche_intervention: ficheIntervention._id })
        const travauxIntervention = await TravauxFicheIntervention.find({ fiche_intervention: ficheIntervention._id })

        // Creation de devis
        const devis = new Devis({
            intervention: idIntervetion,
            etat: EtatDevis.EN_ATTENTE,
            total: 0,
            total_ttc: 0,
        })

        await devis.save()

        // Ajouter les details
        let total = 0

        for (let i = 0; i < piecesIntervention.length; i++) {
            const pieceDevis = new DevisPiece({
                devis: devis._id,
                piece: piecesIntervention[i].piece,
                quantite: piecesIntervention[i].quantite,
                prix_unitaire: piecesIntervention[i].prix_unitaire,
                prix_ht: piecesIntervention[i].quantite * piecesIntervention[i].prix_unitaire
            })

            await pieceDevis.save()

            total += pieceDevis.prix_ht
        }

        for (let i = 0; i < travauxIntervention.length; i++) {
            const travauxDevis = new DevisTravaux({
                devis: devis._id,
                designation: travauxIntervention[i].designation,
                quantite: travauxIntervention[i].quantite,
                prix_unitaire: travauxIntervention[i].prix_unitaire,
                prix_ht: travauxIntervention[i].quantite * travauxIntervention[i].prix_unitaire
            })

            await travauxDevis.save()

            total += travauxDevis.prix_ht
        }

        // Mettre a jour le devis
        const taxe = 20 / 100.0 // TODO: Remplacer depuis une table de configuration
        const prix_ttc = total * (1 + taxe)

        devis.total = total
        devis.total_ttc = prix_ttc

        await devis.save()

        // Mettre a jour intervention
        intervention.devis = devis
        await intervention.save()

        return devis
    }

    // Generer facture
    static async genererFacture(idIntervention, observation = "") {
        const intervention = await Intervetion.findOne({ _id: idIntervention })
        
        if (!intervention.devis) throw new Error("Une erreur s\'est produite")

        // Obtenir le devis
        const devis = await Devis.findOne({ _id: intervention.devis })

        if (devis.etat != EtatDevis.VALIDER) {
            throw new Error("Devis non valider")
        }

        if (intervention.etat_intervention != EtatIntervention.FINI) {
            throw new Error("Intervetion encore en cours")
        }

        // Obtenir les details du devis
        const piecesDevis = await DevisPiece.find({ devis: devis._id })
        const travauxDevis = await DevisTravaux.find({ devis: devis._id })

        // Creation de la facture
        const facture = new Facture({
            intervention: devis.intervention,
            etat: 0, // TODO: Si il y a paiement
            total: 0,
            total_ttc: 0,
            observation: observation,
        })

        await facture.save()

        // Ajouter les details de la facture
        let total = 0

        for (let i = 0; i < piecesDevis.length; i++) {
            const facturePiece = new FacturePiece({
                facture: facture._id,
                piece: piecesDevis[i].piece,
                quantite: piecesDevis[i].quantite,
                prix_unitaire: piecesDevis[i].prix_unitaire,
                prix_ht: piecesDevis[i].prix_unitaire * piecesDevis[i].quantite, 
            })

            await facturePiece.save()

            total += facturePiece.prix_ht
        }

        for (let i = 0; i < travauxDevis.length; i++) {
            const factureTravaux = new FactureTravaux({
                facture: facture._id,
                designation: travauxDevis[i].designation,
                quantite: travauxDevis[i].quantite,
                prix_unitaire: travauxDevis[i].prix_unitaire,
                prix_ht: travauxDevis[i].quantite * travauxDevis[i].prix_unitaire
            })

            await factureTravaux.save()

            total += factureTravaux.prix_ht
        }

        // Mettre a jour a facture
        const taxe = 20 / 100.0 // TODO: Obtenir depuis la base de donnees

        facture.total = total
        facture.total_ttc = total * (1 + taxe)

        await facture.save()

        // Mettre a jour intervention
        await Intervetion.findByIdAndUpdate(devis.intervention, {
            facture: facture
        })

        return facture
    }
}

module.exports = FactureService