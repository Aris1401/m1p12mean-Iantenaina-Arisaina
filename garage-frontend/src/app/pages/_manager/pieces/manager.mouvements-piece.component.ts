import { Component, effect, input, SimpleChanges } from '@angular/core';
import { PiecesService } from '../../../_services/pieces/pieces.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-manager-mouvements-piece',
    imports: [TableModule, DialogModule, ChipModule, CommonModule],
    template: `
        <p-table [value]="mouvementsPiece" [paginator]="true" [rows]="10">
            <ng-template pTemplate="header">
                <tr>
                    <th>Date mouvement</th>
                    <th>Entree</th>
                    <th>Sortie</th>
                    <th>Prix Unitaire</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-piece>
                <tr>
                    <td>
                      <p-chip label="{{ piece.date_mouvement | date: 'yyyy-MM-dd HH:mm' }}"></p-chip>
                    </td>
                    <td>{{ piece.entree }}</td>
                    <td>{{ piece.sortie }}</td>
                    <td>{{ piece.prix_unitaire }} Ar</td>
                </tr>
            </ng-template>
        </p-table>
    `,
    styles: ``
})
export class ManagerMouvementsPieceComponent {
    idPiece: any = input('');

    mouvementsPiece: any[] = [];

    constructor(private pieceService: PiecesService) {
        effect(() => {
            if (this.idPiece().length != 0) {
                this.pieceService.getMouvementStock(this.idPiece()).subscribe((response: any) => {
                    this.mouvementsPiece = response.data;
                });
            }
        });
    }
}
