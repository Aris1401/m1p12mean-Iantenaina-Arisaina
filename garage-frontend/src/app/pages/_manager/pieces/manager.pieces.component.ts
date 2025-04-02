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
import { ManagerMouvementsPieceComponent } from './manager.mouvements-piece.component';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-manager.pieces',
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, DialogModule, CardModule, InputTextModule, SelectModule, FormsModule, ToastModule, DividerModule, ManagerListePiecesComponent, ManagerMouvementsPieceComponent],
    template: `
        <p-card header="Etat du stock">
            <p-table [value]="stockPieces" #stockTable [paginator]="true" [rows]="10" [loading]="isStockLoading" [globalFilterFields]="['reference', 'designation']">
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
                        <td (click)="showMouvementsPiece(piece._id)" class="underline cursor-pointer">{{ piece.reference }}</td>
                        <td (click)="showMouvementsPiece(piece._id)" class="underline cursor-pointer">{{ piece.designation }}</td>
                        <td>{{ piece.prix_cump }} Ar</td>
                        <td>{{ piece.total_entree }}</td>
                        <td>{{ piece.total_sortie }}</td>
                        <td>{{ piece.stock }}</td>
                        <td></td>
                    </tr>
                </ng-template>
            </p-table>
        </p-card>

        <p-dialog header="Ajouter en stock" [(visible)]="isAddStockVisible" [modal]="true" [responsive]="true" [style]="{ width: '60rem' }">
            <div class="flex gap-2">
                <form class="flex flex-col justify-between items-center gap-2 w-1/2" (submit)="onSubmitAddStock()">
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
                            [(ngModel)]="stockPieceData.piece"
                            name="idPiece"
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

                    <button pButton type="submit" label="Ajouter" icon="pi pi-check" class="w-full" [loading]="isAddStockLoading"></button>
                </form>

                <p-divider layout="vertical" />

                <div class="w-1/2">
                    <h5>Interventions en rupture de piece</h5>

                    <p-table [value]="interventionEnRuptureData" [paginator]="true" [rows]="4">
                        <ng-template #emptymessage>
                            <div class="p-3">
                                <p>Aucun intervention en manque de piece</p>
                            </div>
                        </ng-template>

                        <ng-template #header>
                            <tr>
                                <th>Piece</th>
                                <th>Quantite</th>
                                <th>Date intervention</th>
                                <th></th>
                            </tr>
                        </ng-template>

                        <ng-template #body let-interventionEnRupture>
                            <tr>
                                <td>
                                    <p class="underline cursor-pointer" (click)="onPieceSelected(interventionEnRupture.piece._id)">
                                        {{ interventionEnRupture.piece.designation }}
                                    </p>
                                </td>
                                <td>{{ interventionEnRupture.quantite }}</td>
                                <td>{{ interventionEnRupture.createdAt | date: 'yyyy-MM-dd HH:mm' }}</td>
                                <td>
                                    @if (interventionEnRupture.fiche_intervention.intervention) {
                                        <p-button label="Afficher intervention" [routerLink]="['/intervention', interventionEnRupture.fiche_intervention.intervention]" />
                                    } @else {
                                        <p>Intervention introuvable</p>
                                    }
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </p-dialog>

        <div class="mt-3">
            <app-manager-liste-pieces />
        </div>

        <p-dialog header="Mouvement de piece" [maximizable]="true" appendTo="body" [(visible)]="isMouvementsPieceVisible" [style]="{ width: '50vw' }" [modal]="true">
            <app-manager-mouvements-piece [idPiece]="idPieceMouvement" />
        </p-dialog>
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

    // Mouvement piece
    isMouvementsPieceVisible: boolean = false;
    idPieceMouvement: string = '';

    // Manques de pieces
    interventionEnRuptureData: any[] = [];

    // Loader
    isStockLoading: boolean = false;
    isAddStockLoading: boolean = false;

    constructor(
        private piecesService: PiecesService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.isStockLoading = true;

        this.piecesService.getEtatStock().subscribe({
            next: (response: any) => {
                this.stockPieces = response.data;

                this.isStockLoading = false;
            }
        });

        this.piecesService.getPieces().subscribe({
            next: (response: any) => {
                this.allPieces = response.data;
            }
        });

        this.fetchInterventionenRupture();
    }

    fetchInterventionenRupture() {
        this.piecesService.getInterventionEnRupture().subscribe((response: any) => {
            this.interventionEnRuptureData = response.data;
        });
    }

    showAddStockPiece() {
        this.isAddStockVisible = true;
    }

    onPieceSelected(idPiece: any) {
        if (!idPiece) {
            this.isPieceSelected = false;

            this.stockPieceData.piece = '';
            this.stockPieceData.reference = '';
            this.stockPieceData.designation = '';

            return;
        }

        this.isPieceSelected = true;

        this.stockPieceData.piece = idPiece;
        this.stockPieceData.reference = this.allPieces.find((p) => p._id == idPiece).reference;
        this.stockPieceData.designation = this.allPieces.find((p) => p._id == idPiece).designation;
    }

    onSubmitAddStock() {
        this.isAddStockLoading = true;

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
                    summary: response.message[0]
                });

                response.message.slice(1).forEach((message: any) => {
                    this.messageService.add({
                        severity: 'info',
                        summary: message
                    });
                });

                this.isAddStockLoading = false;
            },
            error: (error: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: error.error.error
                });

                this.addStockErrors = error.error.data;

                this.isAddStockLoading = false;
            }
        });
    }

    showMouvementsPiece(idPiece: string) {
        this.isMouvementsPieceVisible = true;
        this.idPieceMouvement = idPiece;
    }
}
