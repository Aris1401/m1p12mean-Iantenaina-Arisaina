import { Component, inject, input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { MecanicienService } from '../../../_services/mecaniciens/mecanicien.service';
import { EtatsService } from '../../../_services/etats.service';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-manager-mecaniciens-interventions',
    imports: [CardModule, TableModule, CommonModule, BadgeModule, ButtonModule, RouterModule, IconFieldModule, InputIconModule, InputTextModule],
    template: `
        <p-card header="Liste des interventions">
            <p-table [value]="interventionData" #interventionTable [paginator]="true" [rows]="15" [loading]="isLoading" [globalFilterFields]="['intervention.utilisateur.nom', 'intervention.utilisateur.prenom', 'intervention.vehicule.immatriculation', 'intervention.createdAt', 'intervention.date_debut', 'intervention.devis.reference', 'intervention.facture.reference']" >
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

                <ng-template pTemplate="header">
                    <tr>
                        <th>Vehicule</th>
                        <th>Client</th>
                        <th pSortableColumn="createdAt">
                            Date Creation <p-sortIcon field="createdAt" />
                        </th>
                        <th pSortableColumn="date_debut">
                            Date Debut <p-sortIcon field="date_debut" />
                        </th>
                        <th>Devis</th>
                        <th>Facture</th>
                        <th>Etat</th>
                        <th></th>
                    </tr>
                </ng-template>

                <ng-template let-assignation #body>
                    <tr>
                        <td>
                            <div class="flex flex-col gap-2">
                                <div class="flex gap-4 align-middle items-center">
                                    <i class="pi pi-car"></i>

                                    <div class="flex flex-col gap-2">
                                        <p class="m-0 font-extrabold">{{ assignation.intervention.vehicule.immatriculation }}</p>

                                        <div class="flex gap-2">
                                            <p class="m-0">{{ assignation.intervention.vehicule.modele }}</p>
                                            <p class="m-0">{{ assignation.intervention.vehicule.marque }}</p>
                                            <p class="m-0">{{ assignation.intervention.vehicule.annee }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="flex flex-col gap-2">
                                <div class="flex gap-4 align-middle items-center">
                                    <i class="pi pi-user"></i>

                                    <div class="flex flex-col gap-2">
                                        <div class="flex gap-2">
                                            <p class="m-0 font-extrabold">{{ assignation.intervention.utilisateur.nom }}</p>
                                            <p class="m-0 font-extrabold">{{ assignation.intervention.utilisateur.prenom }}</p>
                                        </div>

                                        <div class="flex gap-2">
                                            <p class="m-0">{{ assignation.intervention.utilisateur.telephone }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>{{ assignation.intervention.createdAt | date: 'yyyy-MM-dd HH:mm' }}</td>
                        <td>{{ (assignation.intervention.date_debut | date: 'yyyy-MM-dd HH:mm') ?? 'N/A' }}</td>
                        <td>{{ assignation.intervention.devis?.reference ?? 'N/A' }}</td>
                        <td>{{ assignation.intervention.facture?.reference ?? 'N/A' }}</td>
                        <td>
                            <p-badge [severity]="etatsService.getEtatIntervention(assignation.intervention.etat_intervention).etatColor" [value]="etatsService.getEtatIntervention(assignation.intervention.etat_intervention).etatString" />
                        </td>
                        <td>
                            <p-button label="Plus de details" [routerLink]="['/manager/intervention', assignation.intervention._id]" />
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </p-card>
    `,
    styles: ``
})
export class ManagerMecaniciensInterventionsComponent implements OnInit {
    idMecanicien: any = input();
    etatsService: EtatsService = inject(EtatsService);

    // Intervetions data
    interventionData: any[] = [];

    isLoading: boolean = false;

    constructor(private mecanicienService: MecanicienService) {}

    ngOnInit(): void {
        this.isLoading = true;

        this.mecanicienService.getInterventions(this.idMecanicien()).subscribe({
            next: (response: any) => {
                this.interventionData = response.data;

                this.isLoading = false;
            }
        });
    }
}
