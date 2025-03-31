import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FactureService } from '../../../_services/facture/facture.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-manager.factures',
    imports: [CardModule, CommonModule, TableModule, RouterModule, ChipModule, InputTextModule, IconFieldModule, InputIconModule, ButtonModule],
    template: `
        <p-card header="Liste des factures">
            <p-table
                [value]="factures"
                [paginator]="true"
                [rows]="20"
                [stripedRows]="true"
                #listeFactures
                [globalFilterFields]="['reference', 'id_intervention.utilisateur.nom', 'id_intervention.utilisateur.prenom', 'createdAt', 'total', 'total_ttc']"
                sortMode="multiple"
            >
                <ng-template pTemplate="caption">
                    <div class="flex justify-end">
                        <p-icon-field>
                            <p-inputIcon>
                                <i class="pi pi-search"></i>
                            </p-inputIcon>
                            <input type="text" name="search" id="search" pInputText placeholder="Rechercher" (input)="listeFactures.filterGlobal($any($event.target).value, 'contains')" />
                        </p-icon-field>
                    </div>
                </ng-template>
                <ng-template pTemplate="header">
                    <tr>
                        <th>Facture</th>
                        <th>Client</th>
                        <th pSortableColumn="createdAt">
                          Date <p-sortIcon field="createdAt"></p-sortIcon>
                        </th>
                        <th pSortableColumn="total">
                          Montant <p-sortIcon field="total"></p-sortIcon>
                        </th>
                        <th pSortableColumn="total_ttc">
                          Montant (TTC) <p-sortIcon field="total_ttc"></p-sortIcon>
                        </th>
                        <th style="width: 20%"></th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-facture>
                    <tr>
                        <td>
                          <span class="font-bold">
                            {{ facture.reference }}
                          </span>
                        </td>
                        <td>{{ facture.intervention.utilisateur.nom + ' ' + facture.intervention.utilisateur.prenom }}</td>
                        <td>
                            <p-chip>
                                {{ facture.createdAt | date: "yyyy-MM-dd HH:mm" }}
                            </p-chip>
                        </td>
                        <td>{{ facture.total }} Ar</td>
                        <td>{{ facture.total_ttc }} Ar</td>
                        <td>
                          <div class="flex justify-end gap-2">
                            <button pButton icon="pi pi-eye" label="Voir la facture" pTooltipPosition="top" (click)="factureService.downloadFacture(facture._id)"></button>
                            <a pButton icon="pi pi-eye" label="Voir l'intervention" pTooltipPosition="top" [routerLink]="['/manager/intervention', facture.intervention._id]" ></a>
                          </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </p-card>
    `,
    styles: ``
})
export class ManagerFacturesComponent implements OnInit {
    factures = [
    ];

    constructor (
        protected factureService : FactureService
    ) {}

    ngOnInit(): void {
        this.factureService.allFactures().subscribe((response : any) => {
            this.factures = response.data
        })
    }
}
