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
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { FactureService } from '../../../_services/facture/facture.service';
import { DetailsFicheInterventionComponent } from '../../utils/fiche-intervention/details-fiche-intervention.component';

@Component({
    selector: 'app-manager.details-intervention',
    imports: [
        CardModule,
        DialogModule,
        ToastModule,
        FormsModule,
        TextareaModule,
        InfosVehiculeComponent,
        InfosTravauxPiecesComponent,
        InfosGeneralesInterventionComponent,
        ButtonModule,
        TableModule,
        ChipModule,
        BadgeModule,
        CommonModule,
        ManagerAssignationRendezVousComponent,
        DetailsFicheInterventionComponent
    ],
    template: `
        <p-toast></p-toast>

        <div class="flex flex-col gap-2">
            @if (interventionData?.facture) {
                <p-card>
                    <ng-template #title>
                        <div class="flex justify-between items-center">
                            <h5 class="m-0">Facture</h5>
                        </div>
                    </ng-template>

                    <ng-template #content>
                        <p-table [value]="factureData" [stripedRows]="true">
                            <ng-template #header>
                                <tr>
                                    <th>Reference</th>
                                    <th>Date creation</th>
                                    <th>Etat</th>
                                    <th>Total</th>
                                    <th>Total (TTC)</th>
                                    <th style="width: 20%"></th>
                                </tr>
                            </ng-template>

                            <ng-template #body let-facture>
                                <tr>
                                    <td class="font-bold">{{ facture?.reference }}</td>
                                    <td>
                                        <p-chip label="{{ facture?.createdAt | date: 'yyyy-MM-dd HH:mm' }}" />
                                    </td>
                                    <td>
                                        <p-badge [severity]="etatsService.getEtatDevis(facture?.etat).etatColor" [value]="etatsService.getEtatDevis(facture?.etat).etatString" />
                                    </td>
                                    <td>{{ facture?.total }} Ar</td>
                                    <td>{{ facture?.total_ttc }} Ar</td>
                                    <td>
                                        <div class="flex gap-2 justify-end">
                                            <p-button icon="pi pi-download" label="Telecharger" (onClick)="factureService.downloadFacture(facture?._id)" />
                                        </div>
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </ng-template>
                </p-card>
            }

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

            <app-infos-generales-intervention [interventionData]="interventionData" [ficheInterventionData]="ficheInterventionData" (onClickFicheIntervention)="onShowDetailsFicheIntervention($event)" />

            <app-infos-travaux-pieces [pieceLoading]="isPiecesLoading" [travauxLoading]="isTravauxLoading" [travauxData]="travauxData" [piecesData]="piecesData" />

            <p-card>
                <ng-template #title>
                    <div class="flex justify-between items-center">
                        <h5 class="m-0">Liste des devis</h5>

                        @if (interventionData?.etat_intervention != 100) {
                            <p-button label="Generer devis" (onClick)="onGenererDevis()" [loading]="isGenererDevisLoading" />
                        }
                    </div>
                </ng-template>

                <ng-template #content>
                    <p-table [value]="devisData" [stripedRows]="true" [loading]="isDevisLoading">
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
                                        @if (devis?.etat == 10 && interventionData?.etat_intervention == 100 && !interventionData?.facture) {
                                            <p-button label="Generer facture" (onClick)="isGenererFactureVisible = true" />
                                        }
                                        <p-button icon="pi pi-download" label="Telecharger" (onClick)="factureService.downloadDevis(devis?._id)" />
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

                <p-table [value]="assignationsData" [stripedRows]="true" [rows]="10" [paginator]="true" [loading]="isMecaniciensAssignerLoading">
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
                            <td>{{ assignation.createdAt | date: 'yyyy-MM-dd HH:mm' }}</td>
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

        <!-- Observation facture -->
        <p-dialog [(visible)]="isGenererFactureVisible" [modal]="true" header="Ajouter une observation de facture" [style]="{ width: '30rem' }">
            <form (submit)="onGenererFacture()">
                <div class="w-full">
                    <label for="observation" class="block">Observation</label>
                    <textarea id="observation" name="observation" [(ngModel)]="observation" pTextarea rows="8" class="w-full"></textarea>
                </div>

                <p-button label="Generer facture" styleClass="w-full" type="submit" [loading]="isGenererFactureLoading" />
            </form>
        </p-dialog>

        <!-- Details fihe intervention -->
        <p-dialog [(visible)]="isDetailsFicheIntervetionVisible" header="Details fiche intervetion" [style]="{ width: '50rem' }" [modal]="true">
            <app-details-fiche-intervention [ficheInterventionId]="ficheInterventionData?._id" />
        </p-dialog>
    `,
    styles: ``
})
export class ManagerDetailsInterventionComponent {
    intervetionId = signal('');
    interventionData: any;
    ficheInterventionData: any;
    devisData: any = [];
    factureData: any = [];

    travauxData = [];
    piecesData = [];

    // Liste des mecaniciens
    assignationsData: any = [];

    isAssignerMecanicienVisible: boolean = false;

    // Facture
    isGenererFactureVisible: boolean = false;
    observation = '';

    // Details fiche intervention
    isDetailsFicheIntervetionVisible: boolean = false;

    etatsService: EtatsService = inject(EtatsService);
    factureService: FactureService = inject(FactureService);

    // Loader
    isPiecesLoading: boolean = false;
    isTravauxLoading: boolean = false;

    isDevisLoading: boolean = false;

    isMecaniciensAssignerLoading: boolean = false;

    isGenererDevisLoading: boolean = false;
    isGenererFactureLoading: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private intervetionService: InterventionService,
        private ficheIntervetionService: FicheInterventionService,
        private messageService: MessageService
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
        this.isDevisLoading = true;

        this.intervetionService.getDetailsIntervention(_intervetionId).subscribe({
            next: (response: any) => {
                this.interventionData = response.data;

                this.isDevisLoading = false;

                // Obtenir les travaux et pieces
                if (this.interventionData.fiche_intervention) {
                    this.ficheInterventionData = this.interventionData.fiche_intervention;

                    this.isPiecesLoading = true;
                    this.isTravauxLoading = true;

                    this.ficheIntervetionService.getTravauxFicheIntervention(this.interventionData.fiche_intervention._id).subscribe({
                        next: (response: any) => {
                            this.travauxData = response.data;
                            this.isTravauxLoading = false;
                        }
                    });

                    this.ficheIntervetionService.getPiecesFicheIntervention(this.interventionData.fiche_intervention._id).subscribe({
                        next: (response: any) => {
                            this.piecesData = response.data;
                            this.isPiecesLoading = false;
                        }
                    });
                }

                // Details de devis
                if (this.interventionData.devis) {
                    this.devisData = [this.interventionData.devis];
                }

                if (this.interventionData.facture) {
                    this.factureData = [this.interventionData.facture];
                }
            }
        });
    }

    fetchMecaniciensAssigner(idIntervention: any) {
        this.isMecaniciensAssignerLoading = true;

        this.intervetionService.getMecaniciensAssigner(idIntervention).subscribe({
            next: (response: any) => {
                this.assignationsData = response.data;

                this.isMecaniciensAssignerLoading = false;
            }
        });
    }

    onGenererDevis() {
        if (!this.interventionData) return;

        this.isGenererDevisLoading = true;

        this.intervetionService.genererDevis(this.interventionData._id).subscribe({
            next: (response: any) => {
                this.isGenererDevisLoading = false;

                this.fetchIntervetion(this.interventionData._id);

                this.messageService.add({
                    summary: 'Success',
                    detail: response.message,
                    severity: 'success'
                });
            },
            error: (err) => {
                this.isGenererDevisLoading = false;

                this.messageService.add({
                    summary: 'Erreur',
                    detail: err.error.error,
                    severity: 'error'
                });
            }
        });
    }

    onGenererFacture() {
        if (!this.interventionData) return;

        this.isGenererFactureLoading = true;

        this.intervetionService.genererFacture(this.interventionData._id, this.observation).subscribe({
            next: (response: any) => {
                this.isGenererFactureLoading = false;

                this.fetchIntervetion(this.interventionData._id);

                this.isGenererFactureVisible = false;

                this.messageService.add({
                    summary: 'Success',
                    detail: response.message,
                    severity: 'success'
                });
            },
            error: (err) => {
                this.isGenererFactureLoading = false;

                this.messageService.add({
                    summary: 'Erreur',
                    detail: err.error.error,
                    severity: 'error'
                });
            }
        });
    }

    onDesaffecterMecanicien(idIntervetion: any, idMecanicien: any) {
        this.messageService.add({
            summary: "Desaffectation",
            detail: "En cours de desaffectation"
        })

        this.intervetionService.desaffecterMecanicien(idIntervetion, idMecanicien).subscribe({
            next: (response: any) => {
                this.messageService.add({
                    summary: 'Desaffecter',
                    detail: response.message,
                    severity: 'success'
                });

                this.fetchMecaniciensAssigner(idIntervetion);
            },
            error: (err) => {
                this.messageService.add({
                    summary: 'Erreur',
                    detail: "Une erreur s\'est produite",
                    severity: 'error'
                });
            }
        });
    }

    onAssignerMecanicien(idMecanicien: any) {
        this.messageService.add({
            summary: "Affectation",
            detail: "En cours d'assignation"
        })

        this.intervetionService.assignerMecanicien(this.interventionData._id, idMecanicien).subscribe({
            next: (response: any) => {
                this.messageService.add({
                    summary: 'Assigner',
                    detail: response.message,
                    severity: 'success'
                });

                this.fetchMecaniciensAssigner(this.interventionData._id);

                this.isAssignerMecanicienVisible = false;
            },
            error: (err) => {
                this.messageService.add({
                    summary: 'Erreur',
                    detail: err.error.error,
                    severity: 'error'
                });
            }
        });
    }

    onShowDetailsFicheIntervention(ficheIntervention: any) {
        this.isDetailsFicheIntervetionVisible = true;
    }
}
