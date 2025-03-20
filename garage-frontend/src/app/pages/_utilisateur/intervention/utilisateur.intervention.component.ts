import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-utilisateur.intervention',
    imports: [ChipModule, CardModule, TableModule, DividerModule, ButtonModule],
    template: `
        <div>
            <p-card header="Fiche intervetion">
                <div class="flex gap-2 justify-between">
                    <div class="flex gap-2">
                        <p-chip label="Debut: 12/12/2021" />
                        <p-chip label="Debut: N/A" />
                    </div>

                    <div class="flex gap-2">
                        <p-chip label="Diagnostic" />
                        <p-chip label="Accident" />
                    </div>
                </div>

                <div class="mt-3">
                  <p-button label="Details fiche intervention" />
                </div>
              </p-card>
        </div>

        <div class="mt-2">
            <p-card header="Resumer des trauvaux">
                <p-table [value]="travauxData" [stripedRows]="true">
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
    currentIntervetionId: any;

    travauxData = [
      { designation: 'Changement de pneu', quantite: 4, prix_unitaire: 50, prix_ht: 200, etat_intervention: 'Terminé' },
      { designation: 'Vidange', quantite: 1, prix_unitaire: 80, prix_ht: 80, etat_intervention: 'En cours' }
    ];

    devisData = [
      { reference: 'DEV123', createdAt: '2023-01-01', total: 280 },
      { reference: 'DEV124', createdAt: '2023-02-01', total: 150 }
    ]; // TODO: Obtenir depuis backend

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            this.currentIntervetionId = params.id;
        });
    }
}
