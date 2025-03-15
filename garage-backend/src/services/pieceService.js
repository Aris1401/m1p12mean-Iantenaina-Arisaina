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
            total_entree: { $sum: "$mouvements.entree" },
            total_sortie: { $sum: "$mouvements.sortie" },
            prix_cump: { $avg: "$mouvements.prix_unitaire" }
          },
        },
        {
          // Projection finale des champs désirés
          $project: {
            _id: 0,
            reference: 1,
            designation: 1,
            stock: { $subtract: ["$total_entree", "$total_sortie"] },
            total_entree: 1,
            total_sortie: 1,
            prix_cump: 1
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
    let errors = {};

    if (!_piece) {
      const validationErrors = piece.validateSync();
      if (validationErrors) {
        errors['piece'] = validationErrors.errors;
      } else {
        _piece = await piece.save();
      }
    }

    const stock = new StockPiece({
      date_mouvement: dateMouvement ? dateMouvement : new Date(),
      entree: entree,
      sortie: 0,
      prix_unitaire: prixUnitaire,
      piece: _piece ? _piece._id : "",
    });

    const stockValidationErrors = stock.validateSync();
    if (stockValidationErrors) {
      errors['stock'] = stockValidationErrors.errors;
    } else {
      await stock.save();
    }

    if (Object.keys(errors).length > 0) {
      const err = new Error("Veuillez vérifier les champs");
      err.errors = errors;
      throw err;
    }

    // TODO: Si la pièce a été désignée pour une intervention, faire une sortie immédiatement.
  }
}

module.exports = PieceService;
