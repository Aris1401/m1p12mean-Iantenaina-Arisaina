import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterventionService } from '../../../_services/intervention/intervention.service';
import { FicheInterventionService } from '../../../_services/fiche-intervention/fiche-intervention.service';

@Component({
  selector: 'app-new-fiche-intervention',
  imports: [CommonModule, FormsModule],
  templateUrl: './new-fiche-intervention.component.html'
})
export class NewFicheInterventionComponent implements OnInit {
  interventionId: string | null = null;
  intervention: any;
  pieces: any[] = [];
  travauxDescription: string = '';
  typeInterventions: any[] = [];
  typeEvenements: any[] = [];
  selectedTypeIntervention: string = '';
  selectedTypeEvenement: string = '';
  otherEvenement: string = '';
  selectedPieces: any[] = [];
  selectedTravaux: any[] = [];
  travauxfiche: any[] = [];
  filteredTravaux: any[] = [];
  quantite: number = 1;
  prixUnitaire: number = 0;
  prixHT: number = 0;
  etatIntervention: number = 0;
  status: string = '';

  constructor(
    private route: ActivatedRoute,
    private interventionService: InterventionService, // Injection du service
    private ficheInterventionService: FicheInterventionService // Injection du service
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.interventionId = params.get('idIntervention');
      if (this.interventionId) {
        this.loadInterventionData(this.interventionId);
      }
    });
  }

  loadInterventionData(id: string): void {
    this.interventionService.getInterventionData(id).subscribe(
      response => {
        this.intervention = response.data.intervention;
        this.pieces = response.data.pieces;
        this.typeInterventions = response.data.typeInterventions;
        this.typeEvenements = response.data.typeEvenements;
        this.travauxfiche = response.data.travauxFicheIntervention;
      },
      error => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  addPiece() {
    this.selectedPieces.push({
      selectedPiece: '',
      quantity: 1,
      statut: ''
    });
  }

  removePiece(index: number) {
    this.selectedPieces.splice(index, 1);
  }

  addTravail() {
    this.selectedTravaux.push({
      designation: '',
      quantite: 1,
      prixUnitaire: 0,
      prixHT: 0
    });
    this.filteredTravaux.push([]);
  }

  removeTravail(index: number) {
    this.selectedTravaux.splice(index, 1);
    this.filteredTravaux.splice(index, 1);
  }

  getStockStatus(pieceId: string, quantity: number): string {
    const piece = this.pieces.find(p => p._id === pieceId);
    if (piece) {
      if (piece.stockDispo >= quantity) {
        return `En stock (${piece.stockDispo} disponible)`;
      } else if (piece.stockDispo > 0) {
        return `En rupture (${piece.stockDispo} disponible, besoin de ${quantity - piece.stockDispo})`;
      }
    }
    return 'Stock non renseigné';
  }

  updateStockStatus(pieceId: string, quantity: number): void {
    this.interventionService.getPieceStock(pieceId).subscribe(
      response => {
        const stockDispo = response.stockDispo;
        const remainingStock = stockDispo - quantity;
        const devisPiece = response.devisPiece;

        const prixUnitaire = devisPiece ? devisPiece.prix_unitaire : 0;
        this.setPiecePrixUnitaire(pieceId, prixUnitaire);

        if (remainingStock < 0) {
          this.setPieceStatus(pieceId, 'En rupture');
        } else {
          this.setPieceStatus(pieceId, 'En stock');
        }
      },
      error => {
        console.error('Erreur lors de la récupération du stock de la pièce:', error);
      }
    );
  }

  setPieceStatus(pieceId: string, status: string): void {
    const selectedPiece = this.selectedPieces.find(p => p.selectedPiece === pieceId);
    if (selectedPiece) {
      selectedPiece.statut = status;
    }
  }

  setPiecePrixUnitaire(pieceId: string, prixUnitaire: number): void {
    const selectedPiece = this.selectedPieces.find(p => p.selectedPiece === pieceId);
    if (selectedPiece) {
      selectedPiece.prixUnitaire = prixUnitaire;
    }
  }

  saveFicheIntervention(): void {
    if (!this.travauxDescription || !this.selectedTypeIntervention || !this.selectedTypeEvenement) {
      alert('Tous les champs obligatoires doivent être remplis.');
      return;
    }

    const ficheData = {
      description: this.travauxDescription,
      type_intervention: this.selectedTypeIntervention,
      type_evenement: this.selectedTypeEvenement,
      autre_evenement: this.selectedTypeEvenement === 'autre' ? this.otherEvenement : '',
      documents: [],
      pieces: this.selectedPieces,
      travaux: this.selectedTravaux,
      etat_intervention: this.etatIntervention,
      status: this.status
    };

    this.ficheInterventionService.updateFicheIntervention(this.interventionId!, ficheData).subscribe(
      response => {
        console.log('Fiche mise à jour et enregistrée avec succès:', response);
      },
      error => {
        console.error('Erreur lors de la mise à jour de la fiche:', error);
        if (error.error && error.error.message) {
          alert(`Erreur: ${error.error.message}`);
        } else {
          alert('Erreur lors de la mise à jour de la fiche');
        }
      }
    );
  }

  onTravailInputChange(index: number): void {
    const searchText = this.selectedTravaux[index]?.designation || '';
  
    if (searchText) {
      this.filteredTravaux[index] = this.travauxfiche.filter(travail => 
        travail.designation.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      this.filteredTravaux[index] = [];
    }
  }

  onTravailSelected(selectedTravail: any, index: number): void {
    // Ajouter un travail sélectionné avec ses propriétés
    this.selectedTravaux[index] = {
      ...selectedTravail,
      quantite: selectedTravail.quantite || 1,
      prixUnitaire: selectedTravail.prix_unitaire || 0, 
      prixHT: selectedTravail.prix_ht || 0 
    };
  
    // Nettoyer la liste filtrée après la sélection
    this.filteredTravaux[index] = [];
  }
  
}
