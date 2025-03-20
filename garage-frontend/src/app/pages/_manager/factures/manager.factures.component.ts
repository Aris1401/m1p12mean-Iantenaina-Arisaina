import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-manager.factures',
    imports: [CardModule, CommonModule, TableModule, ChipModule, InputTextModule, IconFieldModule, InputIconModule, ButtonModule],
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
                        <td>{{ facture.id_intervention.utilisateur.nom + ' ' + facture.id_intervention.utilisateur.prenom }}</td>
                        <td>
                            <p-chip>
                                {{ facture.createdAt }}
                            </p-chip>
                        </td>
                        <td>{{ facture.total }} Ar</td>
                        <td>{{ facture.total_ttc }} Ar</td>
                        <td>
                          <div class="flex justify-end gap-2">
                            <button pButton icon="pi pi-eye" label="Voir la facture" pTooltipPosition="top"></button>
                            <button pButton icon="pi pi-eye" label="Voir l'intervention" pTooltipPosition="top"></button>
                          </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </p-card>
    `,
    styles: ``
})
export class ManagerFacturesComponent {
    factures = [
        {
            reference: 'FAC001',
            id_intervention: {
                utilisateur: {
                    nom: 'Doe',
                    prenom: 'John'
                }
            },
            createdAt: '2023-01-01',
            total: 10000,
            total_ttc: 12000
        },
        {
            reference: 'FAC002',
            id_intervention: {
                utilisateur: {
                    nom: 'Smith',
                    prenom: 'Jane'
                }
            },
            createdAt: '2023-02-01',
            total: 20000,
            total_ttc: 24000
        }
    ]; // TODO: Obtenir depuis backend
}
