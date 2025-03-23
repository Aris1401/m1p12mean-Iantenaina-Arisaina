import { Component, effect, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { InterventionService } from '../../../_services/intervention/intervention.service';
import { CommonModule } from '@angular/common';
import { FicheInterventionService } from '../../../_services/fiche-intervention/fiche-intervention.service';

@Component({
    selector: 'app-utilisateur.intervention',
    imports: [ChipModule, CardModule, TableModule, DividerModule, ButtonModule, CommonModule],
    template: `
        <div>
            <p-card header="Fiche intervetion">
                <div class="flex gap-2 justify-between">
                    <div class="flex gap-2">
                        <p>Creation: <p-chip label="{{ intervetionData?.createdAt | date: 'yyyy-MM-dd HH:mm' }}" /></p>
                        <p>Debut: <p-chip [label]="intervetionData?.date_debut ?? 'N/A'" /></p>
                    </div>

                    <div class="flex gap-2">
                        <p-chip label="Diagnostic" />
                        <p-chip [label]="ficheInterventionData?.type_evenement?.designation ?? 'N/A'" />
                    </div>
                </div>

                <div class="mt-3">
                    <p-button label="Details fiche intervention" />
                </div>
            </p-card>
        </div>

        <div class="mt-2">
            <p-card>
                <p-table [value]="travauxData" [stripedRows]="true">
                    <ng-template #caption>
                        <h3>Resumer des travaux</h3>
                    </ng-template>
                    <ng-template #header>
                        <tr>
                            <th>Designation</th>
                            <th>Quantite</th>
                            <th>Prix Unitaire</th>
                            <th>Prix (HT)</th>
                            <th>Etat intervention</th>
                        </tr>
                    </ng-template>

                    <ng-template #body let-travaux>
                        <tr>
                            <td>{{ travaux.designation }}</td>
                            <td>{{ travaux.quantite }}</td>
                            <td>{{ travaux.prix_unitaire }} Ar</td>
                            <td>{{ travaux.prix_ht }} Ar</td>
                            <td>{{ travaux.etat_intervention }}</td>
                        </tr>
                    </ng-template>
                </p-table>

                <p-divider />

                <p-table [value]="piecesData" [stripedRows]="true">
                    <ng-template #caption>
                        <h3>Resumer des pieces</h3>
                    </ng-template>
                    <ng-template #header>
                        <tr>
                            <th>Reference</th>
                            <th>Designation</th>
                            <th>Quantite</th>
                            <th>Prix Unitaire</th>
                            <th>Prix (HT)</th>
                            <th>Etat intervention</th>
                        </tr>
                    </ng-template>

                    <ng-template let-piece #body>
                        <tr>
                            <td>{{ piece.piece.reference }}</td>
                            <td>{{ piece.piece.designation }}</td>
                            <td>{{ piece.quantite }}</td>
                            <td>{{ piece.prix_unitaire }} Ar</td>
                            <td>{{ piece.prix_ht }} Ar</td>
                            <td>{{ piece.etat_intervention }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </p-card>
        </div>

        <div class="mt-2">
            <p-card header="Devis">
                <p-table [value]="devisData" [stripedRows]="true">
                    <ng-template #header>
                        <tr>
                            <th>Reference</th>
                            <th>Date creation</th>
                            <th>Total</th>
                            <th style="width: 20%"></th>
                        </tr>
                    </ng-template>

                    <ng-template #body let-devis>
                        <tr>
                            <td class="font-bold">{{ devis.reference }}</td>
                            <td>
                                <p-chip [label]="devis.createdAt" />
                            </td>
                            <td>{{ devis.total }}</td>
                            <td>
                                <div class="flex gap-2 justify-end">
                                    <p-button icon="pi pi-download" label="Telecharger" />
                                    <p-button icon="pi pi-check" label="Valider" />
                                    <p-button icon="pi pi-check" label="Refuser" />
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </p-card>
        </div>
    `,
    styles: ``
})
export class UtilisateurInterventionComponent implements OnInit {
    currentIntervetionId = signal('');

    intervetionData: any = null;
    ficheInterventionData: any = null;

    travauxData = [];
    piecesData = [];
    devisData = [];

    constructor(
        private route: ActivatedRoute,
        private interventionService: InterventionService,
        private ficheIntervetionService : FicheInterventionService
    ) {
        effect(() => {
            if (this.currentIntervetionId().trim().length > 0) {
                // Obtenir les details de l'intervetion
                this.interventionService.getDetailsIntervention(this.currentIntervetionId()).subscribe({
                    next: (response: any) => {
                        this.intervetionData = response.data;

                        // Obtenir la fiche d'intervetion
                        this.ficheInterventionData = this.intervetionData.fiche_intervention;

                        this.ficheIntervetionService.getTravauxFicheIntervention(this.ficheInterventionData._id).subscribe({
                            next: (response: any) => {
                                this.travauxData = response.data;
                            }
                        });

                        // Obtenir les pieces de fiche intervention
                        this.ficheIntervetionService.getPiecesFicheIntervention(this.ficheInterventionData._id).subscribe({
                            next: (response : any) => {
                                this.piecesData = response.data
                            }
                        })
                    }
                });
            }
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            this.currentIntervetionId.set(params.id);
        });
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

    getEtatTravaux(etatTravaux: any) {}
}
