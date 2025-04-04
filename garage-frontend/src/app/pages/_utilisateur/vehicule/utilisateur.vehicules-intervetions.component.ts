import { Component, inject, input, OnInit } from '@angular/core';
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
import { EtatsService } from '../../../_services/etats.service';
import { BadgeModule } from 'primeng/badge';

@Component({
    selector: 'app-utilisateur-vehicules-intervetions',
    imports: [CardModule, TableModule, BadgeModule, ButtonModule, CommonModule, IconFieldModule, InputIconModule, InputTextModule, RouterModule, ChipModule],
    template: `
        @if (isCourantLoading) {
            <div class="p-2 flex items-center gap-2">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                <p>Recherche d'interventio courante</p>
            </div>
        }

        @if (interventionCourante) {
            <p-card header="Intervention courante">
                <div class="flex justify-between items-center">
                    <div class="flex gap-2 flex-col">
                      <div>
                        <p class="m-0">Devis: {{ interventionCourante.devis?.reference ?? "N/A" }}</p>
                        <p class="m-0">Facture: {{ interventionCourante.facture?.reference ?? "N/A" }}</p>
                      </div>

                      <div class="flex gap-2">
                        <p-badge value="Date creation: {{ interventionCourante.createdAt | date: 'yyyy-MM-dd HH:mm' }}" />
                        <p-badge value="Date debut: {{ (interventionCourante.date_debut | date: 'yyyy-MM-dd HH:mm') ?? 'N/A' }}" />
                      </div>
                    </div>
                    <p-badge [value]="etatsService.getEtatIntervention(interventionCourante.etat_intervention).etatString" [severity]="etatsService.getEtatIntervention(interventionCourante.etat_intervention).etatColor" />
                    <div>
                        <button pButton label="Afficher details" type="button" icon="pi pi-eye" class="p-button-rounded p-button-text" [routerLink]="['/intervention', interventionCourante._id]"></button>
                    </div>
                </div>
            </p-card>
        }

        <div class="mt-2">
            <p-card header="Liste des interventions">
                <p-table [value]="interventions" [loading]="isLoading" #interventionTable [paginator]="true" [rows]="10" [rowsPerPageOptions]="[5, 10, 20]" [globalFilterFields]="['createdAt', 'date_debut', 'devis.reference', 'facture.reference']">
                    <ng-template #caption>
                        <div class="flex justify-end">
                            <p-iconField>
                                <p-inputIcon>
                                    <i class="pi pi-search"></i>
                                </p-inputIcon>
                                <input pInputText type="text" placeholder="Rechercher" (input)="interventionTable.filterGlobal($any($event.target).value, 'contains')" />
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
                            <td>{{ (intervention.date_debut | date: "yyyy-MM-dd HH:mm")  || 'N/A' }}</td>
                            <td>{{ intervention.devis?.reference ?? 'N/A' }}</td>
                            <td>{{ intervention.facture?.reference ?? 'N/A' }}</td>
                            <td>
                            <p-badge [value]="etatsService.getEtatIntervention(intervention.etat_intervention).etatString" [severity]="etatsService.getEtatIntervention(intervention.etat_intervention).etatColor" />
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

    etatsService = inject(EtatsService)

    isLoading : boolean = true
    isCourantLoading : boolean = true

    constructor(private interventionService: InterventionService) {}

    ngOnInit(): void {
        this.interventionService.getIntervetionVehicule(this.vehiculeId()).subscribe({
            next: (response: any) => {
                this.interventions = response.data;

                this.isLoading = false
            }
        });

        this.interventionService.getIntervetionVehiculeCourante(this.vehiculeId()).subscribe({
          next: (response : any) => {
            this.interventionCourante = response.data

            this.isCourantLoading = false
          }
        })
    }
}
