import { Component, effect, inject, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InfosVehiculeComponent } from '../../utils/vehicule/infos-vehicule.component';
import { ActivatedRoute } from '@angular/router';
import { InterventionService } from '../../../_services/intervention/intervention.service';
import { InfosTravauxPiecesComponent } from '../../utils/intervention/infos-travaux-pieces.component';
import { FicheInterventionService } from '../../../_services/fiche-intervention/fiche-intervention.service';
import { InfosGeneralesInterventionComponent } from '../../utils/intervention/infos-generales-intervention.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { EtatsService } from '../../../_services/etats.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ManagerAssignationRendezVousComponent } from '../rendez-vous/manager.assignation-rendez-vous.component';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-manager.details-intervention',
    imports: [CardModule, DialogModule, ToastModule, InfosVehiculeComponent, InfosTravauxPiecesComponent, InfosGeneralesInterventionComponent, ButtonModule, TableModule, ChipModule, BadgeModule, CommonModule, ManagerAssignationRendezVousComponent],
    template: `
        <p-toast></p-toast>

        <div class="flex flex-col gap-2">
            <div class="flex gap-2">
                <div class="w-full">
                    <app-infos-vehicule [vehicule]="interventionData?.vehicule" />
                </div>
                <p-card class="w-full h-full" header="Client">
                    <p>Nom: {{ interventionData?.utilisateur?.nom }}</p>
                    <p>Prenom: {{ interventionData?.utilisateur?.prenom }}</p>
                    <p>Email: {{ interventionData?.utilisateur?.email }}</p>
                    <p>Adresse: {{ interventionData?.utilisateur?.addresse }}</p>
                </p-card>
            </div>

            <app-infos-generales-intervention [interventionData]="interventionData" [ficheInterventionData]="ficheInterventionData" />

            <app-infos-travaux-pieces [travauxData]="travauxData" [piecesData]="piecesData" />

            <p-card>
                <ng-template #title>
                    <div class="flex justify-between items-center">
                        <h5 class="m-0">Liste des devis</h5>

                        <p-button label="Generer devis" />
                    </div>
                </ng-template>

                <ng-template #content>
                    <p-table [value]="devisData" [stripedRows]="true">
                        <ng-template #header>
                            <tr>
                                <th>Reference</th>
                                <th>Date creation</th>
                                <th>Etat</th>
                                <th>Total</th>
                                <th style="width: 20%"></th>
                            </tr>
                        </ng-template>

                        <ng-template #body let-devis>
                            <tr>
                                <td class="font-bold">{{ devis?.reference }}</td>
                                <td>
                                    <p-chip label="{{ devis?.createdAt | date: 'yyyy-MM-dd HH:mm' }}" />
                                </td>
                                <td>
                                    <p-badge [severity]="etatsService.getEtatDevis(devis?.etat).etatColor" [value]="etatsService.getEtatDevis(devis?.etat).etatString" />
                                </td>
                                <td>{{ devis?.total }} Ar</td>
                                <td>
                                    <div class="flex gap-2 justify-end">
                                        <p-button icon="pi pi-download" label="Telecharger" />
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </ng-template>
            </p-card>

            <p-card>
                <ng-template #title>
                    <div class="flex justify-between">
                        <h5>Liste des mecaniciens</h5>

                        <p-button label="Assigner mecanicien" icon="pi pi-user-plus" (onClick)="isAssignerMecanicienVisible = true" />
                    </div>
                </ng-template>

                <p-table [value]="assignationsData" [stripedRows]="true" [rows]="10" [paginator]="true">
                    <ng-template #header>
                        <tr>
                            <th>Nom</th>
                            <th>Prenom</th>
                            <th>Date assignation</th>
                            <th></th>
                        </tr>
                    </ng-template>

                    <ng-template let-assignation #body>
                        <tr>
                            <td>{{ assignation.mecanicien.nom }}</td>
                            <td>{{ assignation.mecanicien.prenom }}</td>
                            <td>{{ assignation.createdAt | date: "yyyy-MM-dd HH:mm" }}</td>
                            <td>
                                <p-button label="Desaffecter" icon="pi pi-user-minus" severity="warn" (onClick)="onDesaffecterMecanicien(assignation.intervention._id, assignation.mecanicien._id)" />
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </p-card>
        </div>

        <p-dialog [(visible)]="isAssignerMecanicienVisible" [modal]="true" header="Assigner mecanicien">
            <app-manager-assignation-rendez-vous (assignerMecanicienClicked)="onAssignerMecanicien($event)" />
        </p-dialog>
    `,
    styles: ``
})
export class ManagerDetailsInterventionComponent {
    intervetionId = signal('');
    interventionData: any;
    ficheInterventionData: any;
    devisData: any = [];

    travauxData = [];
    piecesData = [];

    // Liste des mecaniciens
    assignationsData : any = []

    isAssignerMecanicienVisible : boolean = false

    etatsService: EtatsService = inject(EtatsService);

    constructor(
        private route: ActivatedRoute,
        private intervetionService: InterventionService,
        private ficheIntervetionService: FicheInterventionService,
        private messageService : MessageService
    ) {
        this.route.params.subscribe((params: any) => {
            this.intervetionId.set(params.id);
        });

        effect(() => {
            this.fetchIntervetion(this.intervetionId());
            this.fetchMecaniciensAssigner(this.intervetionId());
        });
    }

    fetchIntervetion(_intervetionId: any) {
        this.intervetionService.getDetailsIntervention(_intervetionId).subscribe({
            next: (response: any) => {
                this.interventionData = response.data;

                // Obtenir les travaux et pieces
                if (this.interventionData.fiche_intervention) {
                    this.ficheIntervetionService.getTravauxFicheIntervention(this.interventionData.fiche_intervention).subscribe({
                        next: (response: any) => {
                            this.travauxData = response.data;
                        }
                    });

                    this.ficheIntervetionService.getPiecesFicheIntervention(this.interventionData.fiche_intervention).subscribe({
                        next: (response: any) => {
                            this.piecesData = response.data;
                        }
                    });
                }
            }
        });
    }

    fetchMecaniciensAssigner(idIntervention : any) {
        this.intervetionService.getMecaniciensAssigner(idIntervention).subscribe({
            next: (response : any) => {
                this.assignationsData = response.data
            }
        })
    }

    // TODO: Generer devis

    onDesaffecterMecanicien(idIntervetion : any, idMecanicien : any) {
        this.intervetionService.desaffecterMecanicien(idIntervetion, idMecanicien).subscribe({
            next: (response : any) => {
                this.messageService.add({
                    summary: "Desaffecter",
                    detail: response.message,
                    severity: "success"
                })

                this.fetchMecaniciensAssigner(idIntervetion)
            },
            error: (err) => {
                this.messageService.add({
                    summary: "Erreur",
                    detail: "Une erreur s\'est produite",
                    severity: "error"
                })
            }
        })
    }

    onAssignerMecanicien(idMecanicien : any) {
        this.intervetionService.assignerMecanicien(this.interventionData._id, idMecanicien).subscribe({
            next: (response : any) => {
                this.messageService.add({
                    summary: "Assigner",
                    detail: response.message,
                    severity: "success"
                })

                this.fetchMecaniciensAssigner(this.interventionData._id)

                this.isAssignerMecanicienVisible = false
            },
            error: (err) => {
                this.messageService.add({
                    summary: "Erreur",
                    detail: err.error.error,
                    severity: "error"
                })
            }
        })
    }
}
