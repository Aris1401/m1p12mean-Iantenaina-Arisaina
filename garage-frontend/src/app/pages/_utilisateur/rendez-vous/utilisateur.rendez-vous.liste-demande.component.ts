import { Component, OnInit, ViewChild } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { RendezVousService } from '../../../_services/rendez-vous/rendez-vous.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { VehiculeService } from '../../../_services/vehicule/vehicule.service';

@Component({
    selector: 'app-utilisateur-rendez-vous-liste-demande',
    imports: [TableModule, MultiSelectModule, SelectModule, IconFieldModule, FormsModule, InputIconModule, SelectModule, InputGroupModule, InputGroupAddonModule, InputTextModule, CardModule, ButtonModule, ChipModule, CommonModule, FormsModule],
    standalone: true,
    template: `
        <p-table
            [value]="demandesRendezVous"
            [paginator]="true"
            [rows]="5"
            #demandesrendezvous
            [globalFilterFields]="['date_souhaiter', 'titre', 'type_rendez_vous.designation', 'description', 'vehicule.immatriculation', 'vehicule.marque', 'vehicule.modele', 'vehicule.annee']"
        >
            <ng-template #caption>
                <div class="flex">
                    <p-iconfield iconPosition="left" class="ml-auto">
                        <p-inputicon>
                            <i class="pi pi-search"></i>
                        </p-inputicon>
                        <input pInputText type="text" (input)="demandesrendezvous.filterGlobal($any($event.target).value, 'contains')" placeholder="Search keyword" />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 15%" pSortableColumn="date_souhaiter">Date <p-sortIcon field="date_souhaiter" /></th>
                    <th style="width: 35%;">Informations</th>
                    <th style="width: 25%;">Vehicule</th>
                    <th style="width: 10%;" pSortableColumn="etat_demande">Etat <p-sortIcon field="etat_demande" /></th>
                    <th style="width: 10%;"></th>
                </tr>

                <tr>
                    <th>
                        <p-columnFilter type="date" field="date_souhaiter" placeholder="Date de demande"></p-columnFilter>
                    </th>

                    <th>
                        <p-columnFilter type="text" field="titre,description,type_rendez_vous.designation" />
                    </th>

                    <th>
                        <p-columnFilter matchMode="in" field="vehicule._id" [showMenu]="false" class="w-full">
                            <ng-template #filter let-value let-filter="filterCallback">
                                <p-multi-select [ngModel]="value" [options]="vehiculesUtilisateurs" (onChange)="filter($event.value)" optionValue="_id" optionLabel="immatriculation">
                                    <ng-template let-option #item>
                                        <div class="flex gap-3 items-center">
                                            <i class="pi pi-car"></i>

                                            <div class="flex flex-col gap-2">
                                                <p class="m-0 font-extrabold">{{ option.immatriculation }}</p>

                                                <div class="flex gap-2">
                                                    <p class="m-0">{{ option.modele }}</p>
                                                    <p class="m-0">{{ option.marque }}</p>
                                                    <p class="m-0">{{ option.annee }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </ng-template>
                                </p-multi-select>
                            </ng-template>
                        </p-columnFilter>
                    </th>

                    <th>
                        <p-columnFilter matchMode="equals" field="etat_demande" [showMenu]="false">
                            <ng-template #filter let-value let-filter="filterCallback">
                                <p-select [options]="etatFilterSelect" (onChange)="filter($event.value)" [ngModel]="value" optionValue="value" />
                            </ng-template>
                        </p-columnFilter>
                    </th>

                    <th>

                    </th>
                </tr>
            </ng-template>

            <ng-template let-demande #body>
                <tr>
                    <td>
                        <p-chip class="text-sm" label="{{ demande.date_souhaiter | date: 'yyyy-MM-dd HH:mm' }}" />
                    </td>

                    <td>
                        <div class="flex flex-col gap-2">
                            <div class="flex gap-2 items-center">
                                <p class="m-0 font-bold text-lg">{{ demande.titre }}</p>
                                <p-chip class="text-sm" label="{{ demande.type_rendez_vous.designation }}" />
                            </div>

                            <p class="text-sm">{{ demande.description }}</p>
                        </div>
                    </td>

                    <td>
                        <div class="flex gap-3 items-center">
                            <i class="pi pi-car"></i>

                            <div class="flex flex-col gap-2">
                                <p class="m-0 font-extrabold">{{ demande.vehicule.immatriculation }}</p>

                                <div class="flex gap-2">
                                    <p class="m-0">{{ demande.vehicule.modele }}</p>
                                    <p class="m-0">{{ demande.vehicule.marque }}</p>
                                    <p class="m-0">{{ demande.vehicule.annee }}</p>
                                </div>
                            </div>
                        </div>
                    </td>

                    <td>
                        @switch (demande.etat_demande) {
                            @case (0) {
                                <p-chip label="En cours" />
                            }
                            @case (10) {
                                <p-chip label="Valider" />
                            }
                        }
                    </td>

                    <td>
                        <p-button icon="pi pi-times" label="Annuler" />
                    </td>
                </tr>
            </ng-template>
        </p-table>
    `,
    styles: ``
})
export class UtilisateurRendezVousListeDemandeComponent implements OnInit {
    demandesRendezVous: any[] = [];

    searchValue: string = '';
    selectedEtat: any = null;

    vehiculesUtilisateurs: any[] = [];

    etatFilterSelect : any[] = [
        {
            value: 0,
            label: "En cours"
        },
        {
            value: 10,
            label: "Valider"
        }
    ]

    constructor(
        private rendezVousService: RendezVousService,
        private vehiculeService: VehiculeService
    ) {}

    ngOnInit(): void {
        this.rendezVousService.getDemandesRendezVous().subscribe({
            next: (response: any) => {
                this.demandesRendezVous = response.data;
            }
        });

        this.vehiculeService.getVehicules().subscribe({
            next: (response: any) => {
                this.vehiculesUtilisateurs = response.data;
            }
        });
    }
}
