const RendezVous = require('../model/RendezVous/rendezVous');

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
}

module.exports = StatistiquesManagerService;