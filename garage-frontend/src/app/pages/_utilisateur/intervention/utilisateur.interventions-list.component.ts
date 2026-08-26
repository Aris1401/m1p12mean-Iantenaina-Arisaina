import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { InterventionService } from '../../../_services/intervention/intervention.service';
import { EtatsService } from '../../../_services/etats.service';
import { FactureService } from '../../../_services/facture/facture.service';

@Component({
    selector: 'app-utilisateur-interventions-list',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        TableModule,
        ButtonModule,
        ChipModule,
        BadgeModule,
        DividerModule,
        ToastModule,
        TooltipModule
    ],
    template: `
        <p-toast></p-toast>

        <p-card header="Mes interventions en cours">
            <p class="text-sm text-gray-600 mb-4">
                Consultez ici toutes vos interventions en cours qui nécessitent votre validation (devis ou factures).
            </p>

            <p-table
                [value]="interventionsData"
                [stripedRows]="true"
                [loading]="isLoading"
                [paginator]="true"
                [rows]="10"
                [totalRecords]="interventionsData.length"
                responsiveLayout="scroll"
            >
                <ng-template #header>
                    <tr>
                        <th>Véhicule</th>
                        <th>Date création</th>
                        <th>Devis</th>
                        <th>Facture</th>
                        <th>État</th>
                        <th style="width: 20%">Actions</th>
                    </tr>
                </ng-template>

                <ng-template #body let-intervention>
                    <tr>
                        <!-- Véhicule -->
                        <td>
                            <div class="flex flex-col gap-1">
                                <p class="font-bold">{{ intervention.vehicule?.immatriculation }}</p>
                                <p class="text-sm">{{ intervention.vehicule?.marque }} {{ intervention.vehicule?.modele }}</p>
                            </div>
                        </td>

                        <!-- Date création -->
                        <td>
                            <p-chip label="{{ intervention.createdAt | date: 'yyyy-MM-dd HH:mm' }}" />
                        </td>

                        <!-- Devis -->
                        <td>
                            @if (intervention.devis) {
                                <div class="flex gap-2 items-center">
                                    <p-badge
                                        [severity]="etatsService.getEtatDevis(intervention.devis.etat).etatColor"
                                        [value]="etatsService.getEtatDevis(intervention.devis.etat).etatString"
                                    />
                                    <p class="text-xs text-gray-600">{{ intervention.devis.reference }}</p>
                                </div>
                            } @else {
                                <p-badge severity="warn" value="À générer" />
                            }
                        </td>

                        <!-- Facture -->
                        <td>
                            @if (intervention.facture) {
                                <div class="flex gap-2 items-center">
                                    <p-badge
                                        [severity]="etatsService.getEtatDevis(intervention.facture.etat).etatColor"
                                        [value]="etatsService.getEtatDevis(intervention.facture.etat).etatString"
                                    />
                                    <p class="text-xs text-gray-600">{{ intervention.facture.reference }}</p>
                                </div>
                            } @else {
                                <p-badge severity="info" value="Non générée" />
                            }
                        </td>

                        <!-- État intervention -->
                        <td>
                            <p-badge
                                [severity]="etatsService.getEtatIntervention(intervention.etat_intervention).etatColor"
                                [value]="etatsService.getEtatIntervention(intervention.etat_intervention).etatString"
                            />
                        </td>

                        <!-- Actions -->
                        <td>
                            <div class="flex gap-2 justify-end">
                                <p-button
                                    icon="pi pi-eye"
                                    label="Voir"
                                    class="p-button-sm"
                                    (onClick)="onViewIntervention(intervention._id)"
                                />
                                @if (intervention.devis && intervention.devis.etat === 0) {
                                    <p-button
                                        icon="pi pi-check"
                                        severity="success"
                                        class="p-button-sm p-button-text"
                                        pTooltip="Valider le devis"
                                        tooltipPosition="top"
                                        (onClick)="onValiderDevis(intervention._id)"
                                        [loading]="loadingInterventionId === intervention._id"
                                    />
                                }
                            </div>
                        </td>
                    </tr>

                    <!-- Détails supplémentaires -->
                    <tr>
                        <td colspan="6">
                            <div class="p-3 bg-gray-50 rounded">
                                <div class="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p class="font-semibold text-gray-700">Créé le:</p>
                                        <p>{{ intervention.createdAt | date: 'dd/MM/yyyy à HH:mm' }}</p>
                                    </div>
                                    @if (intervention.date_debut) {
                                        <div>
                                            <p class="font-semibold text-gray-700">Début prévu:</p>
                                            <p>{{ intervention.date_debut | date: 'dd/MM/yyyy à HH:mm' }}</p>
                                        </div>
                                    }
                                    @if (intervention.devis) {
                                        <div>
                                            <p class="font-semibold text-gray-700">Devis Total:</p>
                                            <p class="text-blue-600 font-semibold">{{ intervention.devis.total }} Ar</p>
                                        </div>
                                    }
                                    @if (intervention.facture) {
                                        <div>
                                            <p class="font-semibold text-gray-700">Facture Total (TTC):</p>
                                            <p class="text-green-600 font-semibold">{{ intervention.facture.total_ttc }} Ar</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </td>
                    </tr>
                </ng-template>

                <ng-template #emptymessage>
                    <tr>
                        <td colspan="6" class="text-center py-4">
                            <p class="text-gray-500">Aucune intervention en cours nécessitant votre attention.</p>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </p-card>
    `,
    styles: ``
})
export class UtilisateurInterventionsListComponent implements OnInit {
    interventionsData: any[] = [];
    isLoading: boolean = false;
    loadingInterventionId: string | null = null;

    interventionService = inject(InterventionService);
    etatsService = inject(EtatsService);
    messageService = inject(MessageService);
    factureService = inject(FactureService);
    router = inject(Router);

    ngOnInit(): void {
        this.loadInterventions();
    }

    loadInterventions(): void {
        this.isLoading = true;
        this.messageService.add({
            summary: 'Chargement',
            detail: 'Récupération de vos interventions en cours...',
        });

        this.interventionService.getUtilisateurInterventionsEnCours().subscribe({
            next: (response: any) => {
                this.interventionsData = response.data;
                this.isLoading = false;
                this.messageService.clear();
            },
            error: (error: any) => {
                this.isLoading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger vos interventions',
                    life: 5000
                });
                console.error(error);
            }
        });
    }

    onViewIntervention(interventionId: string): void {
        this.router.navigate(['/intervention', interventionId]);
    }

    onValiderDevis(interventionId: string): void {
        this.loadingInterventionId = interventionId;
        this.interventionService.validerDevisIntervetion(interventionId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Devis validé avec succès',
                    life: 3000
                });
                this.loadingInterventionId = null;
                this.loadInterventions();
            },
            error: (error: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: error?.error?.message || 'Erreur lors de la validation du devis',
                    life: 5000
                });
                this.loadingInterventionId = null;
            }
        });
    }
}
