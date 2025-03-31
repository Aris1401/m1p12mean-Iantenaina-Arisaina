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

const Piece = require('../model/Piece/piece')

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

    static async genererPDFFacture(idFacture) {
        const facture = await Facture.findOne({ _id: idFacture })

        if (!facture) return;
        
        const intervetion = await Intervetion.findOne({ _id: facture.intervention }).populate([
            "vehicule", "utilisateur"
        ])

        // Obtenir les details de facture
        const factureTravaux = await FactureTravaux.find({ facture: facture._id })
        const facturePieces = await FacturePiece.find({ facture: facture._id }).populate("piece")

        // Creation de pdf
        const fs = require('fs')
        const path = require('path')
        const PDFDocument = require('pdfkit')

        let doc = new PDFDocument({ margin: 50 })

        generateHeader(doc, 'Facture Garage', facture.reference, facture.createdAt)
        generateInformations(doc, intervetion.vehicule, intervetion.utilisateur)
        const { lastPos, tableEnd } =  generateTable(doc, facturePieces, factureTravaux, facture.total, facture.total_ttc)
        generateObservation(doc, tableEnd, facture.observation)
        generateFooter(doc, lastPos)

        doc.end()

        const factureFilename = facture.reference + formatDateNoSpace(new Date(facture.createdAt))

        const downloadDir = 'download';
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        return {
            filename: factureFilename, 
            stream: doc.pipe(fs.createWriteStream(path.join(downloadDir, factureFilename + ".pdf")))
        }
    }

    static async generatePDFDevis(idDevis) {
        const devis = await Devis.findOne({ _id: idDevis })

        if (!devis) return;

        const intervetion = await Intervetion.findOne({ _id: devis.intervention }).populate([
            "vehicule", "utilisateur"
        ])

        // Obtenir les details de devis
        const devisTavaux = await DevisTravaux.find({ devis: devis._id })
        const devisPieces = await DevisPiece.find({ devis: devis._id }).populate('piece')

        // Creation de pdf
        const fs = require('fs')
        const path = require('path')
        const PDFDocument = require('pdfkit')

        let doc = new PDFDocument({ margin: 50 })

        generateHeader(doc, 'Devis Garage', devis.reference, devis.createdAt)
        generateInformations(doc, intervetion.vehicule, intervetion.utilisateur)
        const { lastPos, tableEnd } =  generateTable(doc, devisPieces, devisTavaux, devis.total, devis.total_ttc)
        generateFooter(doc, lastPos)

        doc.end()

        const devisFilename = devis.reference + formatDateNoSpace(new Date(devis.createdAt))

        // Ensure the download directory exists
        const downloadDir = 'download';
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        return {
            filename: devisFilename, 
            stream: doc.pipe(fs.createWriteStream(path.join(downloadDir, devisFilename + ".pdf")))
        }
    }
}

// #region PDF FUNCTIONS
function generateHeader(doc, titre, reference, date) {
	doc.fontSize(20).text(titre)
        .fontSize(16).font('Helvetica-Bold').text(reference, 200, 65, { align: 'right' })
		.fontSize(10).font('Helvetica').text('Date: ' + formatDate(new Date(date)), 200, 85, { align: 'right' })
		.moveDown();
}

function generateInformations(doc, vehicule, utilisateur) {
    doc.fontSize(20).font('Helvetica-Bold').text("Informations", 50, 150)

    generateHr(doc, 170)

    // Informations utilisateur
    doc.fontSize(12).font('Helvetica-Bold').text(utilisateur.nom + " " + utilisateur.prenom, 50, 180, { align: "left" })
        .fontSize(10).font('Helvetica').text(utilisateur.adresse, 50, 210)
        .text("Contact: " + (utilisateur.contact ?? "N/A"))
        .text("Email: " + (utilisateur.email ?? "N/A"))

    // Information vehicule
    doc.fontSize(12).font('Helvetica-Bold').text(vehicule.modele + " " + vehicule.marque + " " + vehicule.annee, 10, 180, { align: "right" })
        .fontSize(10).font('Helvetica').text(vehicule.immatriculation, { align: 'right' })
        .text('Kilometrage: ' + vehicule.kilometrage + " km", 10, 210, { align: 'right' })
        .text('Boite de vitesse: ' + vehicule.boite_de_vitesse, { align: 'right' })
        .text('Carburant: ' + vehicule.carburant, { align: 'right' })
    
    generateHr(doc, 250)
}

function generateTable(doc, pieceData = [], travauxData = [], total_ht = 0, total_ttc = 0) {
    let i = 0;
    let tableTop = 300

    // Table header
    doc.font('Helvetica-Bold')
    generateTableRow(
        doc,
        tableTop,
        "Reference",
        "Designation",
        "Prix Unitaire",
        "Quantite",
        "Total (HT)"
    )
    generateHr(doc, tableTop + 15)
    doc.font('Helvetica')

    // Pieces
    generateTableRow(
        doc,
        tableTop + 25,
        "Pieces",
        "",
        "",
        "",
        ""
    )

    i += 1

    for (let j = 0; j < pieceData.length; j++) {
        const piece = pieceData[j]
        const position = tableTop + (i + 1) * 25

        generateTableRow(
            doc,
            position,
            piece.piece.reference,
            piece.piece.designation,
            formatNumber(piece.prix_unitaire) + " Ar",
            piece.quantite,
            formatNumber(piece.prix_ht) + " Ar"
        )

        i++
    }

    // Travaux
    generateHr(doc, tableTop + (i + 1) * 28)
    i++

    generateTableRow(
        doc,
        tableTop + (i + 1) * 25,
        "Travaux",
        "",
        "",
        "",
        ""
    )
    i++

    for (let j = 0; j < travauxData.length; j++) {
        const travaux = travauxData[j]
        const position = tableTop + (i + 1) * 25

        generateTableRow(
            doc,
            position,
            "",
            travaux.designation,
            formatNumber(travaux.prix_unitaire) + " Ar",
            travaux.quantite,
            formatNumber(travaux.prix_ht) + " Ar"
        )

        i++
    }

    // Totals
    const totalStartPos = tableTop + (i + 1) * 30

    // Total HT
    generateTableRow(
        doc,
        totalStartPos,
        "",
        "",
        "Total (HT)",
        "",
        formatNumber(total_ht) + " Ar"
    )

    // TVA
    generateTableRow(
        doc,
        totalStartPos + 20,
        "",
        "",
        "TVA (%)",
        "",
        20.0  // TODO: Obtenir depuis la base de donnees
    )

    // Total TTC
    generateTableRow(
        doc,
        totalStartPos + (20 * 2),
        "",
        "",
        "Total (TTC)",
        "",
        formatNumber(total_ttc) + " Ar"
    )

    return {
        tableEnd: totalStartPos,
        lastPos: totalStartPos + (20 * 3)
    }
}

function generateTableRow(
    doc,
    y,
    reference,
    designation,
    prix_unitaire,
    quantite,
    total
  ) {
    doc
      .fontSize(10)
      .text(reference, 50, y)
      .text(designation, 130, y)
      .text(prix_unitaire, 300, y, { width: 90, align: "right" })
      .text(quantite, 390, y, { width: 90, align: "right" })
      .text(total, 0, y, { align: "right" });
  }

function generateFooter(doc, position = 0) {
	doc.fontSize(
		10,
	).text(
		'Merci.',
		50,
		position + 50,
		{ align: 'center', width: 500 },
	);
}

function generateObservation(doc, position = 0, observation = "") {
    if (observation.trim().length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text("Observation", 50, position - 20)
        doc.fontSize(10).font('Helvetica').text(observation, 50, position, { width: 200 })
    }
}

function generateHr(doc, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

function formatDateNoSpace(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}`;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatNumber(num) {
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: num % 1 !== 0 ? 2 : 0, 
        maximumFractionDigits: 2
    }).format(num).replace(/\s/g, ' ');
}

// #endregion

module.exports = FactureService