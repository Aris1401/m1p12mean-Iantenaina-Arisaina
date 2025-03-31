const RendezVous = require('../model/RendezVous/rendezVous');
const DemandeRendezVous = require('../model/RendezVous/demandeRendezVous')
const Facture = require('../model/Intervention/Facture/facture')

const AssignationIntervention = require('../model/Intervention/assignationIntervention')

const { EtatDemandeRendezVous, EtatRendezVous, EtatIntervention } = require('../model/Etats')

class StatistiquesManagerService {
    static async getRendezVousCountByYearAndMonth(year, state) {
        // Get the first day of the specified year
        const startDate = new Date(year, 0, 1); // January 1st of the specified year
        const endDate = new Date(year + 1, 0, 1); // January 1st of the next year
    
        // Aggregate the count of rendezVous grouped by month for the specified year and state
        const result = await RendezVous.aggregate([
            {
                $match: {
                    date_rendez_vous: { $gte: startDate, $lt: endDate },
                    etat_rendez_vous: state, // Filter by the provided state
                }
            },
            {
                $project: {
                    year: { $year: "$date_rendez_vous" },
                    month: { $month: "$date_rendez_vous" }
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.month": 1 }
            },
            {
                $project: {
                    year: "$_id.year",
                    month: "$_id.month",
                    count: 1,
                    _id: 0
                }
            }
        ]);
    
        // Ensure every month from January to December is included (even with count 0)
        const formattedResult = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1; // MongoDB months are 1-12
            const found = result.find(item => item.year === year && item.month === month);
    
            return {
                year,
                month,
                count: found ? found.count : 0
            };
        });
    
        return formattedResult;
    }

    static async getRendezVousYears() {
        // Get the years of all rendezVous
        const result = await RendezVous.aggregate([
            {
                $project: {
                    year: { $year: "$date_rendez_vous" }
                }
            },
            {
                $group: {
                    _id: "$year"
                }
            },
            {
                $sort: { _id: 1 }
            },
            {
                $project: {
                    year: "$_id",
                    _id: 0
                }
            }
        ]);
    
        return result.map(item => item.year);
    }

    static async getTotalFacturesAnnee(annee) {
        annee = Number(annee)

        // Create date objects for the beginning and end of the requested year
        const startDate = new Date(`${annee}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${annee + 1}-01-01T00:00:00.000Z`);
        
        // Find all invoices created in the specified year
        const facturesAnnee = await Facture.find({
          createdAt: {
            $gte: startDate,
            $lt: endDate
          }
        });
        
        // Calculate the total amount from all invoices
        const totalAmount = facturesAnnee.reduce((sum, facture) => sum + facture.total, 0);
        const totalTTC = facturesAnnee.reduce((sum, facture) => sum + facture.total_ttc, 0);
        
        // Calculate data for the previous year
        const startDatePrevious = new Date(`${annee - 1}-01-01T00:00:00.000Z`);
        const endDatePrevious = new Date(`${annee}-01-01T00:00:00.000Z`);
        
        const facturesPreviousYear = await Facture.find({
          createdAt: {
            $gte: startDatePrevious,
            $lt: endDatePrevious
          }
        });
        
        const totalAmountPrevious = facturesPreviousYear.reduce((sum, facture) => sum + facture.total, 0);
        const totalTTCPrevious = facturesPreviousYear.reduce((sum, facture) => sum + facture.total_ttc, 0);
        
        // Calculate growth percentages
        let growthPercentage = 0;
        let growthPercentageTTC = 0;
        
        if (totalAmountPrevious > 0) {
          growthPercentage = ((totalAmount - totalAmountPrevious) / totalAmountPrevious) * 100;
        }
        
        if (totalTTCPrevious > 0) {
          growthPercentageTTC = ((totalTTC - totalTTCPrevious) / totalTTCPrevious) * 100;
        }
        
        return {
          count: facturesAnnee.length,
          countPreviousYear: facturesPreviousYear.length,
          total: totalAmount,
          total_ttc: totalTTC,
          previousYearTotal: totalAmountPrevious,
          previousYearTotalTTC: totalTTCPrevious,
          growthPercentage: parseFloat(growthPercentage.toFixed(2)),
          growthPercentageTTC: parseFloat(growthPercentageTTC.toFixed(2)),
          signe: growthPercentageTTC >= 0 ? "+" : "-",
          facturesAnnee
        };
      }

      static async getTotalFacturesJour() {
        // Obtenir la date actuelle
        const aujourdhui = new Date();
        
        // Créer les dates de début et fin pour aujourdhui
        const debutJour = new Date(aujourdhui);
        debutJour.setHours(0, 0, 0, 0);
        
        const finJour = new Date(aujourdhui);
        finJour.setHours(23, 59, 59, 999);
        
        // Trouver toutes les factures créées aujourdhui
        const facturesJour = await Facture.find({
          createdAt: {
            $gte: debutJour,
            $lt: finJour
          }
        });
        
        // Calculer le montant total de toutes les factures du jour
        const totalAmount = facturesJour.reduce((sum, facture) => sum + facture.total, 0);
        const totalTTC = facturesJour.reduce((sum, facture) => sum + facture.total_ttc, 0);
        
        // Calculer les données pour le même jour de l'année précédente
        const jourPrecedent = new Date(aujourdhui);
        jourPrecedent.setFullYear(aujourdhui.getFullYear() - 1);
        
        const debutJourPrecedent = new Date(jourPrecedent);
        debutJourPrecedent.setHours(0, 0, 0, 0);
        
        const finJourPrecedent = new Date(jourPrecedent);
        finJourPrecedent.setHours(23, 59, 59, 999);
        
        const facturesJourPrecedent = await Facture.find({
          createdAt: {
            $gte: debutJourPrecedent,
            $lt: finJourPrecedent
          }
        });
        
        const totalAmountPrecedent = facturesJourPrecedent.reduce((sum, facture) => sum + facture.total, 0);
        const totalTTCPrecedent = facturesJourPrecedent.reduce((sum, facture) => sum + facture.total_ttc, 0);
        
        // Calculer les pourcentages de croissance
        let growthPercentage = 0;
        let growthPercentageTTC = 0;
        
        if (totalAmountPrecedent > 0) {
          growthPercentage = ((totalAmount - totalAmountPrecedent) / totalAmountPrecedent) * 100;
        }
        
        if (totalTTCPrecedent > 0) {
          growthPercentageTTC = ((totalTTC - totalTTCPrecedent) / totalTTCPrecedent) * 100;
        }
        
        return {
          date: aujourdhui.toISOString().split('T')[0],
          count: facturesJour.length,
          countPreviousDay: facturesJourPrecedent.length,
          total: totalAmount,
          total_ttc: totalTTC,
          previousDayTotal: totalAmountPrecedent,
          previousDayTotalTTC: totalTTCPrecedent,
          growthPercentage: parseFloat(growthPercentage.toFixed(2)),
          growthPercentageTTC: parseFloat(growthPercentageTTC.toFixed(2)),
          signe: growthPercentageTTC >= 0 ? "+" : "-",
          facturesJour
        };
      }

      static async getNombreDemandeRendezVous() {
        const aujourdHui = new Date();
        const debutJour = new Date(aujourdHui.setHours(0, 0, 0, 0));
        const finJour = new Date(aujourdHui.setHours(23, 59, 59, 999));

        const demandeRendezVous = await DemandeRendezVous.find({ 
            etat_demande: EtatDemandeRendezVous.EN_COURS,
            date_souhaiter: { $gte: debutJour, $lte: finJour}
        })

        const demandeRendezVousAnnuler = await DemandeRendezVous.find({ 
            etat_demande: EtatDemandeRendezVous.ANNULER,
            date_souhaiter: { $gte: debutJour, $lte: finJour}
        }) 

        return {
            nombre: demandeRendezVous.length,
            annuler: demandeRendezVousAnnuler.length
        }
      }

      static async getNombreRendezVous() {
        const aujourdHui = new Date();
        const debutJour = new Date(aujourdHui.setHours(0, 0, 0, 0));
        const finJour = new Date(aujourdHui.setHours(23, 59, 59, 999));

        const rendezVous = await RendezVous.find({ 
            etat_demande: EtatRendezVous.EN_ATTENTE,
            date_souhaiter: { $gte: debutJour, $lte: finJour}
        })

        const rendezVousAnnuler = await RendezVous.find({ 
            etat_demande: EtatRendezVous.ANNULER,
            date_souhaiter: { $gte: debutJour, $lte: finJour}
        }) 

        return {
            nombre: rendezVous.length,
            annuler: rendezVousAnnuler.length
        }
      }
    
      static async nombreAssignationMecanicien() {
        try {
          const assignments = await AssignationIntervention.find()
            .populate({
              path: 'mecanicien',
              select: ["-mot_de_passe", "-documents"]
            })
            .populate('intervention');
          
          const mechanicAssignments = {};
          
          assignments.forEach(({ mecanicien, intervention }) => {
            const mecId = mecanicien._id.toString();
            if (!mechanicAssignments[mecId]) {
              mechanicAssignments[mecId] = {
                mecanicien,
                nombre: 0,
              };
            }

            if (intervention.etat_intervention != EtatIntervention.FINI) {
              mechanicAssignments[mecId].nombre += 1;
            }
          });
          
          return Object.values(mechanicAssignments);
        } catch (error) {
          console.error("Error fetching assignment count:", error);
          throw error;
        }
      }
    
    static async obtenirEvolutionFacture(annee, mois) {
      try {
        // Validation des paramètres
        if (!annee || !mois || mois < 1 || mois > 12) {
          throw new Error("Année et mois valides sont requis (mois entre 1-12)");
        }
        
        // Calculer la date de début (premier jour du mois)
        const dateDebut = new Date(annee, mois - 1, 1);
        
        // Calculer la date de fin (dernier jour du mois)
        const dateFin = new Date(annee, mois, 0);
        const nombreJours = dateFin.getDate();
        
        // Requête pour récupérer toutes les factures du mois
        const factures = await Facture.find({
          createdAt: {
            $gte: dateDebut,
            $lte: new Date(annee, mois - 1, nombreJours, 23, 59, 59)
          }
        }).sort({ createdAt: 1 });
        
        // Initialiser un tableau avec tous les jours du mois
        const donneesBrutes = [];
        for (let jour = 1; jour <= nombreJours; jour++) {
          donneesBrutes.push({
            date: `${jour}/${mois}/${annee}`,
            jour: jour,
            totalTTC: 0,
            nombreFactures: 0
          });
        }
        
        // Remplir les données TTC pour chaque jour
        factures.forEach(facture => {
          const jour = facture.createdAt.getDate();
          donneesBrutes[jour - 1].totalTTC += facture.total_ttc || 0;
          donneesBrutes[jour - 1].nombreFactures += 1;
        });
        
        // Calculer les totaux cumulatifs TTC
        let cumulTTC = 0;
        donneesBrutes.forEach(item => {
          cumulTTC += item.totalTTC;
          item.cumulTTC = cumulTTC;
        });
        
        // Générer les tableaux pour le graphique
        const tableauJours = donneesBrutes.map(item => item.jour);
        const tableauDates = donneesBrutes.map(item => item.date);
        const tableauTotalTTC = donneesBrutes.map(item => item.totalTTC);
        const tableauCumulTTC = donneesBrutes.map(item => item.cumulTTC);
        const tableauNombreFactures = donneesBrutes.map(item => item.nombreFactures);
        
        // Retourner l'objet avec tous les tableaux nécessaires
        return {
          jours: tableauJours,
          dates: tableauDates,
          totalTTC: tableauTotalTTC,
          cumulTTC: tableauCumulTTC,
          nombreFactures: tableauNombreFactures,
          donneesBrutes: donneesBrutes
        };
        
      } catch (error) {
        console.error("Erreur lors de la récupération des données d'évolution TTC:", error);
        throw error;
      }
    }
    
}

module.exports = StatistiquesManagerService;