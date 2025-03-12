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

@Component({
    selector: 'app-utilisateur-rendez-vous-liste-demande',
    imports: [DataViewModule, SelectModule, InputGroupModule, InputGroupAddonModule, InputTextModule, CardModule, ButtonModule, ChipModule, CommonModule, FormsModule],
    standalone: true,
    template: `
        <div class="flex gap-2 items-center mb-3">
            <p-select [options]="etatFilter" [style]="{ width: '15rem' }" [(ngModel)]="selectedEtat" (onChange)="onFilter()" />
            <p-input-group>
                <input pInputText type="text" name="search" id="search" placeholder="Rechercher" [(ngModel)]="searchValue" />

                <p-inputgroup-addon>
                    <p-button icon="pi pi-search" (onClick)="onSearch()" />
                </p-inputgroup-addon>
            </p-input-group>
        </div>

        <p-data-view [value]="filteredDemandesRendezVous" [paginator]="true" [rows]="5" #demandesrendezvous filterBy="titre,description,date_souhaiter,vehicule.marque,vehicule.modele,vehicule.annee,vehicule.immatriculation">
            <ng-template let-demandes #list>
                <div class="flex flex-col gap-2">
                    @for (demande of demandes; track demande._id) {
                        <p-card>
                            <div class="flex justify-between">
                                <div class="flex flex-col gap-2">
                                    <div class="flex gap-2 items-center">
                                        <p class="m-0 font-bold text-lg">{{ demande.titre }}</p>
                                        <p-chip class="text-sm" label="{{ demande.date_souhaiter | date: 'yyyy-MM-dd HH:mm' }}" />
                                        <p-chip class="text-sm" label="{{ demande.type_rendez_vous.designation }}" />
                                    </div>

                                    <p class="text-sm">{{ demande.description }}</p>
                                </div>

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

                                <div class="flex flex-col gap-1">
                                    @switch (demande.etat_demande) {
                                        @case (0) {
                                            <p-chip label="En cours" />
                                        }
                                        @case (10) {
                                            <p-chip label="Valider" />
                                        }
                                    }
                                    <p-button icon="pi pi-times" label="Annuler" />
                                </div>
                            </div>
                        </p-card>
                    }
                </div>
            </ng-template>
        </p-data-view>
    `,
    styles: ``
})
export class UtilisateurRendezVousListeDemandeComponent implements OnInit {
    demandesRendezVous: any[] = [];
    filteredDemandesRendezVous: any[] = [];

    searchValue: string = '';
    selectedEtat: string = '';

    etatFilter: any[] = [
        {
            label: 'Tout',
            value: null
        },
        {
            label: 'Demandes en cours',
            value: 0
        },
        {
            label: 'Demandes validees',
            value: 10
        }
    ];

    @ViewChild('demandesrendezvous') demandesDataView: any;

    constructor(private rendezVousService: RendezVousService) {}

    ngOnInit(): void {
        this.rendezVousService.getDemandesRendezVous().subscribe({
            next: (response: any) => {
                this.demandesRendezVous = response.data;
            }
        });
    }

    onSearch() {
        this.applyFilters();
    }

    onFilter() {
        this.applyFilters();
    }

    applyFilters() {
        this.filteredDemandesRendezVous = this.demandesRendezVous.filter((demande) => {
            const matchesText = this.searchValue
                ? Object.values(demande).some((value: any) => {
                      	return value?.toString().toLowerCase().includes(this.searchValue.toLowerCase());
                  })
                : true;

            const matchesEtat = this.selectedEtat !== null ? demande.etat_demande === this.selectedEtat : true;

            return matchesText && matchesEtat;
        });
    }
}
