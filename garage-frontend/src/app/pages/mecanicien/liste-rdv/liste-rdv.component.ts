import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { InterventionService } from '../../../_services/intervention/intervention.service';  // Importer le service
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RendezVousService } from '../../../_services/rendez-vous/rendez-vous.service';

@Component({
  selector: 'app-liste-rdv',
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule],
  templateUrl: './liste-rdv.component.html',
  providers: [DatePipe]
})
export class ListeRdvComponent implements OnInit {
  ArrayRDV: any[] = [];

  EtatRendezVous = {
    EN_ATTENTE: 0,
    ANNULER: -10,
    EN_COURS: 10,
    FINI: 20
  };

  constructor(
    private rdvService: RendezVousService,
    private interventionService: InterventionService,  // Injection du service
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getAllRDV();
  }

  getAllRDV() {
    this.rdvService.getAllRDV().subscribe(
      (resultData: any) => {
        this.ArrayRDV = resultData.data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des rendez-vous', error);
      }
    );
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || date;
  }

  getEtatLabel(etat: number): string {
    switch (etat) {
      case this.EtatRendezVous.EN_ATTENTE:
        return 'En attente';
      case this.EtatRendezVous.ANNULER:
        return 'Annulé';
      case this.EtatRendezVous.EN_COURS:
        return 'En cours';
      case this.EtatRendezVous.FINI:
        return 'Fini';
      default:
        return 'Inconnu';
    }
  }

  // Utilisation de la méthode du service pour créer l'intervention
  goToCreateIntervention(id: string): void {
    this.interventionService.createIntervention(id).subscribe(
      (response) => {
        console.log('Intervention créée avec succès');
        const interventionId = response.data._id;
        this.router.navigate(['/new-fiche-intervention', interventionId]);
      },
      (error) => {
        console.error('Erreur lors de la création de l\'intervention', error);
      }
    );
  }
}
