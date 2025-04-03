import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { InterventionService } from '../../../_services/intervention/intervention.service';
import { CommonModule } from '@angular/common';
import { FicheInterventionService } from '../../../_services/fiche-intervention/fiche-intervention.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EtatsService } from '../../../_services/etats.service';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { UtilisateurDebutInterventionComponent } from './utilisateur.debut-intervention.component';
import { InfosTravauxPiecesComponent } from '../../utils/intervention/infos-travaux-pieces.component';
import { FactureService } from '../../../_services/facture/facture.service';
import { DetailsFicheInterventionComponent } from '../../utils/fiche-intervention/details-fiche-intervention.component';

@Component({
    selector: 'app-utilisateur.intervention',
    imports: [UtilisateurDebutInterventionComponent, InfosTravauxPiecesComponent, ChipModule, CardModule, ToastModule, BadgeModule, TableModule, DividerModule, ButtonModule, CommonModule, DialogModule, DetailsFicheInterventionComponent],
    template: `
        <p-toast></p-toast>

        <div class="flex flex-col gap-2">
            @if (intervetionData?.facture) {
                <p-card header="Devis">
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
                </p-card>
            }

            <p-card>
                <ng-template #title>
                    <div class="flex gap-2 items-center pb-2">
                        <h5 class="m-0">Fiche intervetion</h5>
                        <p-badge [value]="etatsService.getEtatIntervention(intervetionData?.etat_intervention).etatString" [severity]="etatsService.getEtatIntervention(intervetionData?.etat_intervention).etatColor" />
                    </div>
                </ng-template>

                <div class="flex gap-2 justify-between">
                    <div class="flex gap-2">
                        <p>Creation: <p-chip label="{{ intervetionData?.createdAt | date: 'yyyy-MM-dd HH:mm' }}" /></p>
                        <p>Debut: <p-chip [label]="(intervetionData?.date_debut | date: 'yyyy-MM-dd HH:mm') ?? 'N/A'" /></p>
                    </div>

                    <div class="flex gap-2">
                        <p-chip label="Diagnostic" />
                        <p-chip [label]="ficheInterventionData?.type_evenement?.designation ?? 'N/A'" />
                    </div>
                </div>

                <div class="mt-3">
                    <p-button label="Details fiche intervention" (onClick)="onAfficherDetailsFicheIntervention()" />
                </div>
            </p-card>
        </div>

        <div class="mt-2">
            <app-infos-travaux-pieces [travauxLoading]="isTravauxLoading" [pieceLoading]="isPiecesLoading" [travauxData]="travauxData" [piecesData]="piecesData" />
        </div>

        <div class="mt-2">
            <p-card header="Devis">
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
                                    <p-button icon="pi pi-download" label="Telecharger" (onClick)="factureService.downloadDevis(devis?._id)" />
                                    @if (devis?.etat == 0) {
                                        <p-button icon="pi pi-check" label="Valider" (onClick)="onValiderDevis(devis.intervention)" />
                                        <p-button severity="danger" icon="pi pi-check" label="Refuser" (onClick)="onRefuserDevis(devis.intervention)" />
                                    }
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </p-card>
        </div>

        <div class="mt-2">
            <p-card>
                <ng-template #title>
                    <div class="flex justify-between">
                        <h5>Liste des mecaniciens</h5>
                    </div>
                </ng-template>

                <p-table [value]="assignationsData" [loading]="isAssignationLoading" [stripedRows]="true" [rows]="10" [paginator]="true">
                    <ng-template #header>
                        <tr>
                            <th>Nom</th>
                            <th>Prenom</th>
                            <th>Date assignation</th>
                        </tr>
                    </ng-template>

                    <ng-template let-assignation #body>
                        <tr>
                            <td>{{ assignation.mecanicien.nom }}</td>
                            <td>{{ assignation.mecanicien.prenom }}</td>
                            <td>{{ assignation.createdAt | date: 'yyyy-MM-dd HH:mm' }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </p-card>
        </div>

        <!-- Selection date debut -->
        <p-dialog [(visible)]="isSelectionDateVisible" [modal]="true" header="Selectionner une date de debut d'intervetion" style="width: 30rem">
            <app-utilisateur-debut-intervention style="width: 100%;" [intervetionId]="currentIntervetionId()" (dateValider)="onDateValider()" />
        </p-dialog>

        <!-- Details fiche intervention -->
         <p-dialog [(visible)]="isFicheInterventionVisible" [modal]="true" header="Details fiche intervention" [style]="{width: '40rem'}">
            <app-details-fiche-intervention [ficheInterventionId]="ficheInterventionData?._id" />
         </p-dialog>
    `,
    styles: ``
})
export class UtilisateurInterventionComponent implements OnInit {
    currentIntervetionId = signal('');

    intervetionData: any = null;
    ficheInterventionData: any = null;

    travauxData = [];
    piecesData = [];
    devisData: any[] = [];
    factureData: any[] = [];

    assignationsData: any[] = [];

    etatsService = inject(EtatsService);
    factureService = inject(FactureService);

    isSelectionDateVisible: boolean = false;

    // Fiche intervention
    isFicheInterventionVisible : boolean = false

    // Loaders
    isPiecesLoading : boolean = false
    isTravauxLoading : boolean = false

    isFactureLoading : boolean = false
    isDevisLoading : boolean = false
    
    isAssignationLoading : boolean = false

    constructor(
        private route: ActivatedRoute,
        private messageService: MessageService,
        private interventionService: InterventionService,
        private ficheIntervetionService: FicheInterventionService
    ) {
        effect(() => {
            if (this.currentIntervetionId().trim().length > 0) {
                // Obtenir les details de l'intervetion
                this.fetchIntervetion();
            }
        });
    }

    fetchIntervetion() {
        this.isSelectionDateVisible = false;

        this.isPiecesLoading = true
        this.isTravauxLoading = true
        this.isFactureLoading = true
        this.isDevisLoading = true

        this.interventionService.getDetailsIntervention(this.currentIntervetionId()).subscribe({
            next: (response: any) => {
                this.intervetionData = response.data;
                this.devisData = [this.intervetionData.devis];
                this.factureData = [this.intervetionData.facture];

                this.isFactureLoading = false
                this.isDevisLoading = false

                // Obtenir la fiche d'intervetion
                this.ficheInterventionData = this.intervetionData.fiche_intervention;

                if (this.ficheInterventionData) {
                    this.ficheIntervetionService.getTravauxFicheIntervention(this.ficheInterventionData._id).subscribe({
                        next: (response: any) => {
                            this.travauxData = response.data;
                            
                            this.isTravauxLoading = false
                        }
                    });

                    // Obtenir les pieces de fiche intervention
                    this.ficheIntervetionService.getPiecesFicheIntervention(this.ficheInterventionData._id).subscribe({
                        next: (response: any) => {
                            this.piecesData = response.data;

                            this.isPiecesLoading = false
                        }
                    });
                } else {
                    this.isTravauxLoading = false
                    this.isPiecesLoading = false
                }

                // Check si il faut selectionner une date de debut
                this.checkDebutSelecionVisibility();
                this.fetchMecaniciensAssigner(this.intervetionData._id);
            }
        });
    }

    fetchMecaniciensAssigner(idIntervention: any) {
        this.isAssignationLoading = true

        this.interventionService.getMecaniciensAssigner(idIntervention).subscribe({
            next: (response: any) => {
                this.assignationsData = response.data;

                this.isAssignationLoading = false
            }
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            this.currentIntervetionId.set(params.id);
        });
    }

    checkDebutSelecionVisibility() {
        if (!this.intervetionData || !this.devisData || !this.devisData[0]) return;

        if (this.intervetionData.etat_intervention == -10 && this.devisData[0].etat == 10 && !this.intervetionData.date_debut) {
            this.isSelectionDateVisible = true;
        }
    }

    onValiderDevis(intervetionId: any) {
        this.interventionService.validerDevisIntervetion(intervetionId).subscribe({
            next: (response: any) => {
                this.fetchIntervetion();

                this.messageService.add({
                    summary: 'Devis valider',
                    detail: response.message,
                    severity: 'success'
                });
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

    onRefuserDevis(interventionId: any) {
        this.interventionService.refuserDevisIntervetion(interventionId).subscribe({
            next: (response: any) => {
                this.fetchIntervetion();

                this.messageService.add({
                    summary: 'Devis refuser',
                    detail: response.message,
                    severity: 'success'
                });
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

    onDateValider() {
        this.fetchIntervetion();
    }

    onAfficherDetailsFicheIntervention() {
        this.isFicheInterventionVisible = true
    }
}
