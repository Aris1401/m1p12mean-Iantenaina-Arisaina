const Piece = require("../model/Piece/piece");
const StockPiece = require("../model/Piece/stockPiece");

const PieceFicheIntervention = require("../model/Intervention/FicheIntervention/pieceFicheIntervention");

class PieceService {
  static async obtenirEtatStock() {
    try {
      const pieces = await Piece.find().lean();

      const stockMovements = await StockPiece.find().lean();

      const etatStock = pieces.map((piece) => {
        const mouvements = stockMovements.filter(
          (m) => String(m.piece) === String(piece._id)
        );

        const totalEntree = mouvements.reduce(
          (sum, m) => sum + (m.entree || 0),
          0
        );
        const totalSortie = mouvements.reduce(
          (sum, m) => sum + (m.sortie || 0),
          0
        );

        const validMovements = mouvements.filter((m) => m.entree > 0);

        const prixCump =
          validMovements.length > 0
            ? validMovements.reduce(
                (sum, m) => sum + (m.prix_unitaire || 0),
                0
              ) / validMovements.length
            : 0;

        return {
          _id: piece._id,
          reference: piece.reference,
          designation: piece.designation,
          stock: totalEntree - totalSortie,
          total_entree: totalEntree,
          total_sortie: totalSortie,
          prix_cump: prixCump,
        };
      });

      return etatStock;
    } catch (error) {
      throw new Error(
        "Erreur lors de la récupération de l'état du stock: " + error.message
      );
    }
  }

  static async obtenirEtatStockPiece(idPiece) {
    try {
      const piece = await Piece.findById(idPiece).lean();
      if (!piece) {
        throw new Error("Pièce non trouvée");
      }

      const mouvements = await StockPiece.find({ piece: idPiece }).lean();

      const totalEntree = mouvements.reduce(
        (sum, m) => sum + (m.entree || 0),
        0
      );
      const totalSortie = mouvements.reduce(
        (sum, m) => sum + (m.sortie || 0),
        0
      );

      const validMovements = mouvements.filter((m) => m.entree > 0);

      const prixCump =
        validMovements.length > 0
          ? validMovements.reduce((sum, m) => sum + (m.prix_unitaire || 0), 0) /
            validMovements.length
          : 0;

      return {
        _id: piece._id,
        reference: piece.reference,
        designation: piece.designation,
        stock: totalEntree - totalSortie,
        total_entree: totalEntree,
        total_sortie: totalSortie,
        prix_cump: prixCump,
      };
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
        errors["piece"] = validationErrors.errors;
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
      errors["stock"] = stockValidationErrors.errors;
    } else {
      await stock.save();
    }

    if (Object.keys(errors).length > 0) {
      const err = new Error("Veuillez vérifier les champs");
      err.errors = errors;
      throw err;
    }

    let messages = [];

    // Obtenir les pieces intervention en rupture de stock
    const piecesFicheIntervention = await PieceFicheIntervention.find({
      etat_intervention: 0,
    }).sort({ createdAt: 1 });

    for (const pieceIntervention of piecesFicheIntervention) {
      try {
        await this.sortirEnStock(
          _piece,
          pieceIntervention.quantite,
          pieceIntervention.prix_unitaire,
          new Date()
        );

        // Si la sortie est fait avec success
        pieceIntervention.etat_intervention = 20; // TODO: Changer par etat dans Etats.js
        await pieceIntervention.save();

        // Message de confirmation
        messages.push(
          `Quantite de ${pieceIntervention.quantite} de ${_piece.designation} en sortie vers l'intervention en rupture de piece`
        );
      } catch (error) {
        messages.push(
          `Quantite insuffisante pour intervention (${error.message})`
        );
        continue;
      }
    }

    return messages;
  }

  static async sortirEnStock(piece, sortie, prixUnitaire, dateMouvement) {
    let _piece = await Piece.findOne({ _id: piece._id });
    let errors = {};

    if (!_piece) {
      throw new Error("Piece invalide");
    }

    // Avant de sotir de stick verifier si il y en a assez
    const etatStock = await this.obtenirEtatStockPiece(_piece._id);

    let totalApresSortie = etatStock.stock - sortie;
    if (totalApresSortie < 0) {
      throw new Error(
        `Stock insuffisant pour ${_piece.designation} (En sortie: ${sortie} | En stock: ${etatStock.stock})`
      );
    }

    const stock = new StockPiece({
      date_mouvement: dateMouvement ? dateMouvement : new Date(),
      entree: 0,
      sortie: sortie,
      prix_unitaire: prixUnitaire,
      piece: _piece ? _piece._id : "",
    });

    const stockValidationErrors = stock.validateSync();
    if (stockValidationErrors) {
      errors["stock"] = stockValidationErrors.errors;
    } else {
      await stock.save();
    }

    if (Object.keys(errors).length > 0) {
      const err = new Error("Veuillez vérifier les champs");
      err.errors = errors;
      throw err;
    }
  }
}

module.exports = PieceService;
