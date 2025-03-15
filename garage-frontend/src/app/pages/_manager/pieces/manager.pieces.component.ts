import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { PiecesService } from '../../../_services/pieces/pieces.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ManagerListePiecesComponent } from './manager.liste-pieces.component';

@Component({
    selector: 'app-manager.pieces',
    imports: [TableModule, ButtonModule, DialogModule, CardModule, InputTextModule, SelectModule, FormsModule, ToastModule, ManagerListePiecesComponent],
    template: `
        <p-card header="Etat du stock">
            <p-table [value]="stockPieces" #stockTable [paginator]="true" [rows]="10" [globalFilterFields]="['reference', 'designation']">
                <ng-template #caption>
                    <div class="flex justify-between items-center">
                        <p-button label="Ajouter en stock" icon="pi pi-plus" (onClick)="showAddStockPiece()"></p-button>

                        <div class="flex">
                            <input type="text" name="search" id="search" pInputText placeholder="Rechercher" (input)="stockTable.filterGlobal($any($event.target).value, 'contains')" />
                        </div>
                    </div>
                </ng-template>

                <ng-template #header>
                    <tr>
                        <th>Reference</th>
                        <th>Designation</th>
                        <th>Prix</th>
                        <th>Total en entree</th>
                        <th>Total en sortie</th>
                        <th>Stock</th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template let-piece #body>
                    <tr>
                        <td>{{ piece.reference }}</td>
                        <td>{{ piece.designation }}</td>
                        <td>{{ piece.prix_cump }}</td>
                        <td>{{ piece.total_entree }}</td>
                        <td>{{ piece.total_sortie }}</td>
                        <td>{{ piece.stock }}</td>
                        <td></td>
                    </tr>
                </ng-template>
            </p-table>
        </p-card>

        <p-dialog header="Ajouter en stock" [(visible)]="isAddStockVisible" [modal]="true" [responsive]="true" [style]="{ width: '30rem' }">
            <form class="flex flex-col justify-between items-center gap-2" (submit)="onSubmitAddStock()">
                <div class="w-full">
                    <label for="piece" class="block">Piece</label>
                    <p-select
                        [options]="allPieces"
                        optionLabel="designation"
                        optionValue="_id"
                        placeholder="Selectionner une piece"
                        [filter]="true"
                        filterBy="designation,reference"
                        class="w-full"
                        (onChange)="onPieceSelected($event.value)"
                        [showClear]="true"
                    >
                        <ng-template let-piece #item>
                            <div class="flex flex-col justify-between">
                                <span>{{ piece.designation }}</span>
                                <span>{{ piece.reference }}</span>
                            </div>
                        </ng-template>
                    </p-select>
                </div>

                <div class="w-full">
                    <label for="reference" class="block">Reference</label>
                    <input
                        type="text"
                        name="reference"
                        id="reference"
                        pInputText
                        class="w-full"
                        [(ngModel)]="stockPieceData.reference"
                        [disabled]="isPieceSelected"
                        [class.p-dirty]="addStockErrors && addStockErrors.piece && addStockErrors.piece.reference"
                        [class.p-invalid]="addStockErrors && addStockErrors.piece && addStockErrors.piece.reference"
                    />
                </div>

                <div class="w-full">
                    <label for="designation" class="block">Designation</label>
                    <input
                        type="text"
                        name="designation"
                        id="designation"
                        pInputText
                        class="w-full"
                        [(ngModel)]="stockPieceData.designation"
                        [disabled]="isPieceSelected"
                        [class.p-dirty]="addStockErrors && addStockErrors.piece && addStockErrors.piece.designation"
                        [class.p-invalid]="addStockErrors && addStockErrors.piece && addStockErrors.piece.designation"
                    />
                </div>

                <div class="w-full">
                    <label for="dateMouvement" class="block">Date de mouvement</label>
                    <input type="date" name="dateMouvement" id="dateMouvement" pInputText class="w-full" [(ngModel)]="stockPieceData.dateMouvement" />
                </div>

                <div class="w-full">
                    <label for="prix" class="block">Prix</label>
                    <input
                        type="text"
                        name="prix"
                        id="prix"
                        pInputText
                        class="w-full"
                        [(ngModel)]="stockPieceData.prix"
                        [class.p-dirty]="addStockErrors && addStockErrors.stock && addStockErrors.stock.prix_unitaire"
                        [class.p-invalid]="addStockErrors && addStockErrors.stock && addStockErrors.stock.prix_unitaire"
                    />
                    @if (addStockErrors && addStockErrors.stock && addStockErrors.stock.prix_unitaire) {
                      <small class="text-red-500">{{ addStockErrors.stock.prix_unitaire.message }}</small>
                    }
                </div>

                <div class="w-full">
                    <label for="quantite" class="block">Quantite</label>
                    <input
                        type="text"
                        name="quantite"
                        id="quantite"
                        pInputText
                        class="w-full"
                        [(ngModel)]="stockPieceData.quantite"
                        [class.p-dirty]="addStockErrors && addStockErrors.stock && addStockErrors.stock.entree"
                        [class.p-invalid]="addStockErrors && addStockErrors.stock && addStockErrors.stock.entree"
                    />
                    @if (addStockErrors && addStockErrors.stock && addStockErrors.stock.entree) {
                      <small class="text-red-500">{{ addStockErrors.stock.entree.message }}</small>
                    }
                </div>

                <button pButton type="submit" label="Ajouter" icon="pi pi-check" class="w-full"></button>
            </form>
        </p-dialog>

        <div class="mt-3">
            <app-manager-liste-pieces />
        </div>
    `,
    styles: ``
})
export class ManagerPiecesComponent implements OnInit {
    stockPieces: any[] = [];
    allPieces: any[] = [];

    isAddStockVisible: boolean = false;

    stockPieceData = {
        piece: '',
        reference: '',
        designation: '',
        dateMouvement: '',
        prix: 0,
        quantite: 0
    };

    isPieceSelected: boolean = false;

    addStockErrors: any;

    constructor(
        private piecesService: PiecesService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.piecesService.getEtatStock().subscribe({
            next: (response: any) => {
                this.stockPieces = response.data;
            }
        });

        this.piecesService.getPieces().subscribe({
            next: (response: any) => {
                this.allPieces = response.data;
            }
        });
    }

    showAddStockPiece() {
        this.isAddStockVisible = true;
    }

    onPieceSelected(idPiece: any) {
        this.isPieceSelected = true;

        this.stockPieceData.piece = idPiece;
        this.stockPieceData.reference = this.allPieces.find((p) => p._id == idPiece).reference;
        this.stockPieceData.designation = this.allPieces.find((p) => p._id == idPiece).designation;
    }

    onSubmitAddStock() {
        this.piecesService.ajouterStock(this.stockPieceData).subscribe({
            next: (response: any) => {
                this.isAddStockVisible = false;
                this.isPieceSelected = false;

                this.ngOnInit();

                this.stockPieceData = {
                    piece: '',
                    reference: '',
                    designation: '',
                    dateMouvement: '',
                    prix: 0,
                    quantite: 0
                };

                this.messageService.add({
                    severity: 'success',
                    summary: response.message
                });
            },
            error: (error: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: error.error.error
                });

                this.addStockErrors = error.error.data;
            }
        });
    }
}
