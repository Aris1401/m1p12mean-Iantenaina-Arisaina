import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PiecesService } from '../../../_services/pieces/pieces.service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-manager-liste-pieces',
    imports: [CardModule, DialogModule, ButtonModule, InputTextModule, TableModule, FormsModule, ToastModule],
    template: `
        <p-toast></p-toast>

        <p-card header="Liste des pieces">
            <p-table [value]="pieces" #piecesTable [paginator]="true" [rows]="10" [globalFilterFields]="['reference', 'designation']">
                <ng-template #caption>
                    <div class="flex justify-between items-center">
                        <div class="flex">
                            <input type="text" name="search" id="search" pInputText placeholder="Rechercher" (input)="piecesTable.filterGlobal($any($event.target).value, 'contains')" />
                        </div>
                    </div>
                </ng-template>
                <ng-template #header>
                    <tr>
                        <th>Reference</th>
                        <th>Designation</th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template let-piece #body>
                    <tr>
                        <td>{{ piece.reference }}</td>
                        <td>{{ piece.designation }}</td>
                        <td>
                            <div class="flex justify-end">
                                <p-button label="Modifier" icon="pi pi-pencil" (onClick)="onModifierPiece(piece)"></p-button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </p-card>

        <p-dialog header="Modifier piece" [modal]="true" [responsive]="true" [style]="{ width: '30rem' }" [(visible)]="isModifyPieceVisible" >
            <form class="flex flex-col justify-between items-center gap-2" (submit)="onSubmitModifyPiece()">
                <div class="w-full">
                    <label for="reference" class="block">Reference</label>
                    <input type="text" name="reference" id="reference" pInputText class="w-full" [(ngModel)]="pieceData.reference" [class.p-invalid]="modificationErrors.reference" [class.p-dirty]="modificationErrors.reference" />
                </div>

                <div class="w-full">
                    <label for="designation" class="block">Designation</label>
                    <input type="text" name="designation" id="designation" pInputText class="w-full" [(ngModel)]="pieceData.designation" [class.p-invalid]="modificationErrors.designation" [class.p-dirty]="modificationErrors.designation" />
                </div>

                <p-button type="submit" label="Modifier" class="w-full"></p-button>
            </form>
        </p-dialog>
    `,
    styles: ``
})
export class ManagerListePiecesComponent implements OnInit {
    pieces: any[] = [];

    pieceData : any = {
        reference: '',
        designation: '',
        id: ""
    };

    isModifyPieceVisible: boolean = false;

    modificationErrors : any = {}

    constructor(
        private peiceService: PiecesService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.peiceService.getPieces().subscribe({
            next: (response: any) => {
                this.pieces = response.data;
            }
        });
    }

    onModifierPiece(piece : any) {
      this.pieceData.reference = piece.reference;
      this.pieceData.designation = piece.designation;
      this.pieceData.id = piece._id;

      this.isModifyPieceVisible = true
    }

    onSubmitModifyPiece() {
      this.peiceService.modifierPiece(this.pieceData).subscribe({
        next: (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Piece modifie avec succes' });
          this.isModifyPieceVisible = false;
          this.modificationErrors = {}
        }, error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error });

          this.modificationErrors = err.error.data;
        }
      });
    }
}
