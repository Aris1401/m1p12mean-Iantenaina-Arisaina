import { Component, effect, input, SimpleChanges } from '@angular/core';
import { PiecesService } from '../../../_services/pieces/pieces.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { IconField } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-manager-mouvements-piece',
    imports: [TableModule, DialogModule, ChipModule, CommonModule, IconField, InputIconModule, InputTextModule],
    template: `
        <p-table [value]="mouvementsPiece" #mouvementTable [paginator]="true" [rows]="10" [globalFilterFields]="['date_mouvement']">
            <ng-template #caption>
                <div class="flex justify-end">
                    <p-iconField>
                        <p-inputIcon>
                            <i class="pi pi-search"></i>
                        </p-inputIcon>
                        <input pInputText type="text" placeholder="Rechercher" (input)="mouvementTable.filterGlobal($any($event.target).value, 'contains')" />
                    </p-iconField>
                </div>
            </ng-template>

            <ng-template pTemplate="header">
                <tr>
                    <th pSortableColumn="date_mouvement">Date mouvement <p-sortIcon field="date_mouvement" /></th>
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
