const Piece = require("../model/Piece/piece");
const StockPiece = require("../model/Piece/stockPiece");

class PieceService {
  static async obtenirEtatStock() {
    try {
      const etatStock = await Piece.aggregate([
        {
          // Pour chaque pièce, on va chercher les documents associés dans StockPiece
          $lookup: {
            from: "stockpieces", // Note : assurez-vous que le nom de la collection correspond (par défaut, Mongoose utilise le pluriel en minuscule)
            localField: "_id",
            foreignField: "piece",
            as: "mouvements",
          },
        },
        {
          // On calcule la somme des entrées et des sorties
          $addFields: {
            totalEntree: { $sum: "$mouvements.entree" },
            totalSortie: { $sum: "$mouvements.sortie" },
          },
        },
        {
          // Projection finale des champs désirés
          $project: {
            _id: 0,
            reference: 1,
            designation: 1,
            quantiteEnStock: { $subtract: ["$totalEntree", "$totalSortie"] },
            totalEntree: 1,
            totalSortie: 1,
          },
        },
      ]);
      return etatStock;
    } catch (error) {
      throw new Error(
        "Erreur lors de la récupération de l'état du stock: " + error.message
      );
    }
  }

  static async ajouterEnStock(piece, entree, prixUnitaire, dateMouvement) {
    let _piece = await Piece.findOne({ _id: piece._id });

    if (!_piece) {
      _piece = await piece.save();
    }

    const stock = new StockPiece({
      date_mouvement: dateMouvement,
      entree: entree,
      sortie: 0,
      prix_unitaire: prixUnitaire,
      piece: _piece._id,
    });

    await stock.save();

    // TODO: Si la pièce a été désignée pour une intervention, faire une sortie immédiatement.
  }
}

module.exports = PieceService;
