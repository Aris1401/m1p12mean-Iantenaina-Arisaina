import { Component, inject, input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { MecanicienService } from '../../../_services/mecaniciens/mecanicien.service';
import { EtatsService } from '../../../_services/etats.service';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-manager-mecaniciens-interventions',
    imports: [CardModule, TableModule, CommonModule, BadgeModule, ButtonModule, RouterModule],
    template: `
        <p-card header="Liste des interventions">
            <p-table [value]="interventionData">
                <ng-template pTemplate="header">
                    <tr>
                      <th>Vehicule</th>
                        <th>Client</th>
                        <th>Date Creation</th>
                        <th>Date Debut</th>
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
                                        <p class="m-0 font-extrabold">{{assignation.intervention.vehicule.immatriculation }}</p>

                                        <div class="flex gap-2">
                                            <p class="m-0">{{assignation.intervention.vehicule.modele }}</p>
                                            <p class="m-0">{{assignation.intervention.vehicule.marque }}</p>
                                            <p class="m-0">{{assignation.intervention.vehicule.annee }}</p>
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
                                            <p class="m-0 font-extrabold">{{assignation.intervention.utilisateur.nom }}</p>
                                            <p class="m-0 font-extrabold">{{assignation.intervention.utilisateur.prenom }}</p>
                                        </div>

                                        <div class="flex gap-2">
                                            <p class="m-0">{{assignation.intervention.utilisateur.telephone }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>{{ assignation.intervention.createdAt | date: "yyyy-MM-dd HH:mm" }}</td>
                        <td>{{ (assignation.intervention.date_debut | date: "yyyy-MM-dd HH:mm") ?? "N/A" }}</td>
                        <td>{{ assignation.intervention.devis?.reference ?? "N/A" }}</td>
                        <td>{{ assignation.intervention.facture?.reference ?? "N/A" }}</td>
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

    constructor(private mecanicienService: MecanicienService) {}

    ngOnInit(): void {
        this.mecanicienService.getInterventions(this.idMecanicien()).subscribe({
            next: (response: any) => {
                this.interventionData = response.data;
            }
        });
    }
}
