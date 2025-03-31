import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InterventionService } from '../../../_services/intervention/intervention.service';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste-intervention',
    imports: [CommonModule, NgClass, FormsModule],
  templateUrl: './liste-intervention.component.html'
})
export class ListeInterventionComponent implements OnInit {
  ArrayIntervention: any[] = [];

  constructor(
    private interventionService: InterventionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllIntervention();
  }

  // Récupérer toutes les interventions via le service
  getAllIntervention(): void {
    this.interventionService.getAllInterventions().subscribe(
      (resultData: any) => {
        this.ArrayIntervention = resultData.data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des interventions', error);
      }
    );
  }

  // Utiliser la méthode du service pour obtenir l'état de l'intervention
  getEtatIntervention(etat: number): string {
    return this.interventionService.getEtatIntervention(etat);
  }

  // Rediriger vers la création de la fiche d'intervention
  creerFicheIntervention(idIntervention: string): void {
    this.router.navigate([`/new-fiche-intervention/${idIntervention}`]);
  }
}
