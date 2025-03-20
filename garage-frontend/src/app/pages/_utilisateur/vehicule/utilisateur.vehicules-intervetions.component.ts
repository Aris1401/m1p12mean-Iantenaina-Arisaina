import { Component, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { InterventionService } from '../../../_services/intervention/intervention.service';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-utilisateur-vehicules-intervetions',
    imports: [CardModule, TableModule, ButtonModule, CommonModule, IconFieldModule, InputIconModule, InputTextModule, RouterModule, ChipModule],
    template: `
        @if (interventionCourante) {
            <p-card header="Intervention courante">
                <div class="flex justify-between items-center">
                    <div class="flex gap-2 flex-col">
                      <div>
                        <p class="m-0">Devis: {{ interventionCourante.devis?.reference ?? "N/A" }}</p>
                        <p class="m-0">Facture: {{ interventionCourante.facture?.reference ?? "N/A" }}</p>
                      </div>

                      <div>
                        <p class="m-0">Date creation: {{ interventionCourante.createdAt | date: 'yyyy-MM-dd HH:mm' }}</p>
                        <p class="m-0">Date debut: {{ (interventionCourante.date_debut | date: "yyyy-MM-dd HH:mm") ?? "N/A" }}</p>
                      </div>
                    </div>
                    <p>Etat: {{ getEtatIntervention(interventionCourante.etat_intervention) }}</p>
                    <div>
                        <button pButton label="Afficher details" type="button" icon="pi pi-eye" class="p-button-rounded p-button-text" [routerLink]="['/intervention', interventionCourante._id]"></button>
                    </div>
                </div>
            </p-card>
        }

        <div class="mt-2">
            <p-card header="Liste des interventions">
                <p-table [value]="interventions" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[5, 10, 20]">
                    <ng-template #caption>
                        <div class="flex justify-end">
                            <p-iconField>
                                <p-inputIcon>
                                    <i class="pi pi-search"></i>
                                </p-inputIcon>
                                <input pInputText type="text" placeholder="Rechercher" />
                            </p-iconField>
                        </div>
                    </ng-template>

                    <ng-template #header>
                        <tr>
                            <th pSortableColumn="createdAt">Date intervention <p-sortIcon field="createdAt"></p-sortIcon></th>
                            <th pSortableColumn="date_debut">Date debut intervention <p-sortIcon field="date_debut"></p-sortIcon></th>
                            <th>Devis</th>
                            <th>Facture</th>
                            <th pSortableColumn="etat_intervention">Statut <p-sortIcon field="etat_intervention"></p-sortIcon></th>
                            <th></th>
                        </tr>
                    </ng-template>

                    <ng-template let-intervention #body>
                        <tr>
                            <td>{{ intervention.createdAt | date: "yyyy-MM-dd HH:mm" }}</td>
                            <td>{{ intervention.date_debut || 'N/A' }}</td>
                            <td>{{ intervention.devis?.reference ?? 'N/A' }}</td>
                            <td>{{ intervention.facture?.reference ?? 'N/A' }}</td>
                            <td>
                                <p-chip [label]="getEtatIntervention(intervention.etat_intervention)" />
                            </td>
                            <td>
                                <button pButton label="Afficher details" type="button" icon="pi pi-eye" class="p-button-rounded p-button-text" [routerLink]="['/intervention', intervention._id]"></button>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </p-card>
        </div>
    `,
    styles: ``
})
export class UtilisateurVehiculesIntervetionsComponent implements OnInit {
    vehiculeId = input();

    interventions : any[] = [];

    interventionCourante : any 

    constructor(private interventionService: InterventionService) {}

    ngOnInit(): void {
        this.interventionService.getIntervetionVehicule(this.vehiculeId()).subscribe({
            next: (response: any) => {
                this.interventions = response.data;
            }
        });

        this.interventionService.getIntervetionVehiculeCourante(this.vehiculeId()).subscribe({
          next: (response : any) => {
            this.interventionCourante = response.data
          }
        })
    }

    getEtatIntervention(etatIntervention: any) {
        switch (etatIntervention) {
            case -10:
                return 'En attente';
            case 0:
                return 'En cours';
            case 10:
                return 'En attente de piece';
            default:
                return 'Fini';
        }
    }
}
