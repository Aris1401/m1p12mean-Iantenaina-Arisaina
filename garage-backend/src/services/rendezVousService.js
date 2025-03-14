const DemandeRendezVous = require("../model/RendezVous/demandeRendezVous");
const RendezVous = require("../model/RendezVous/rendezVous");

const { EtatDemandeRendezVous, EtatRendezVous } = require("../model/Etats");

class RendezVousService {
  static combineDateTimes(dateArray) {
    if (!dateArray || dateArray.length === 0) return [];

    // Ensure each item is a Date object.
    const dates = dateArray.map((item) =>
      item instanceof Date ? item : new Date(item)
    );

    // Sort the dates in ascending order.
    dates.sort((a, b) => a - b);

    const result = [];
    const thresholdMs = 30 * 60 * 1000; // 30 minutes in milliseconds
    let groupStart = dates[0];
    let groupEnd = dates[0];

    for (let i = 1; i < dates.length; i++) {
      const currentDate = dates[i];

      // Check if the difference between the current date and the end of the group is within 30 minutes.
      if (currentDate - groupEnd <= thresholdMs) {
        groupEnd = currentDate; // Extend the current group.
      } else {
        // Finish the current group and start a new one.
        result.push({ start: groupStart, end: groupEnd });
        groupStart = currentDate;
        groupEnd = currentDate;
      }
    }

    // Push the final group.
    result.push({ start: groupStart, end: groupEnd });

    return result;
  }

  // Valider demande rendez-vous
  static async validerDemandeRendezVous(idDemande) {
    const demandeRendezVous = await DemandeRendezVous.findOne({
      _id: idDemande,
    });

    // Verification si la demande des valide
    if (demandeRendezVous.etat_demande != EtatDemandeRendezVous.EN_COURS) {
      throw new Error("Une erreur est survenue");
    }

    // Creation de rendez-vous a partir de demande
    const rendezVous = new RendezVous({
      date_rendez_vous: demandeRendezVous.date_souhaiter,
      etat_rendez_vous: EtatRendezVous.EN_ATTENTE,
      demande_rendez_vous: demandeRendezVous._id,
    });

    await rendezVous.save();

    // Mettre a jour l'etat de la demande en valider
    demandeRendezVous.etat_demande = EtatDemandeRendezVous.VALIDER;
    await demandeRendezVous.save();
  }

  // Obtenir les indisponibilites
  static async obtenirHeuresIndisponibles() {
    const rendezVous = await RendezVous.find()
      .where("etat_rendez_vous")
      .in([EtatRendezVous.EN_ATTENTE, EtatRendezVous.EN_COURS])
      .select(["date_rendez_vous", "-_id"]);

    const heures = rendezVous.map((item) => item.date_rendez_vous);

    const clumpedHours = this.combineDateTimes(heures);

    return clumpedHours;
  }

  // Valider la demande de rendez-vous
  static async verifierHeureDemandeRendezVous(demandeRendezVous) {
    const heuresIndisponibles = await this.obtenirHeuresIndisponibles();

	const dateSouhaiter = new Date(demandeRendezVous.date_souhaiter);
	console.log("Heure demandée:", dateSouhaiter.toISOString());

    for (let i = 0; i < heuresIndisponibles.length; i++) {
		const start = new Date(heuresIndisponibles[i].start);
        let end = new Date(heuresIndisponibles[i].end);

		if (start.getTime() === end.getTime()) {
            end = new Date(start.getTime() + 30 * 60 * 1000); 
        }

		console.log(`Indisponible ${i + 1}: Start = ${start.toISOString()}, End = ${end.toISOString()}`);

		console.log(dateSouhaiter >= start &&
			dateSouhaiter <= end)
      if (
        dateSouhaiter >= start &&
        dateSouhaiter <= end
      ) {
        return false; // Time slot is unavailable
      }
    }

    return true; // Time slot is available
  }
}

module.exports = RendezVousService;
