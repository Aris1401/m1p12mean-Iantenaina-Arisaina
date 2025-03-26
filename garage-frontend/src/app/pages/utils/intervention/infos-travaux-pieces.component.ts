import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-infos-travaux-pieces',
    imports: [CardModule, TableModule, DividerModule],
    template: `
        <p-card>
            <p-table [value]="travauxData()" [stripedRows]="true">
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

            <p-table [value]="piecesData()" [stripedRows]="true">
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
    `,
    styles: ``
})
export class InfosTravauxPiecesComponent {
  piecesData = input([])
  travauxData = input([])
}
