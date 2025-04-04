import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { RendezVousService } from '../../../_services/rendez-vous/rendez-vous.service';
import { CommonModule } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { EtatsService } from '../../../_services/etats.service';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ManagerAssignationRendezVousComponent } from '../rendez-vous/manager.assignation-rendez-vous.component';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InterventionService } from '../../../_services/intervention/intervention.service';

@Component({
    selector: 'app-manager-tableau-de-bord-reminders',
    standalone: true,
    imports: [CardModule, TableModule, CommonModule, ChipModule, DialogModule, BadgeModule, ButtonModule, DialogModule, ManagerAssignationRendezVousComponent, RouterModule, InputTextModule, IconFieldModule, InputIconModule],
    template: `
        <p-dialog></p-dialog>

        <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                <div class="w-full">
                    <p-card header="Rendez-Vous du jour">
                        <p-table
                            [value]="rendezVousJourData"
                            #rendezVousTable
                            [paginator]="true"
                            [rows]="5"
                            [loading]="isRendezVousLoading"
                            [globalFilterFields]="[
                                'demande_rendez_vous.titre',
                                'demande_rendez_vous.description',
                                'demande_rendez_vous.utilisateur.nom',
                                'demande_rendez_vous.utilisateur.prenom',
                                'demande_rendez_vous.vehicule.immatriculation',
                                'demande_rendez_vous.vehicule.modele',
                                'demande_rendez_vous.vehicule.marque',
                                'demande_rendez_vous.vehicule.annee'
                            ]"
                        >
                            <ng-template #emptymessage>
                                <div class="p-3">
                                    <p>Aucun rendez-vous pour aujourd'hui. Veuillez vous referer au <a class="underline" [routerLink]="['/manager/rendez-vous']">calendrier</a></p>
                                </div>
                            </ng-template>

                            <ng-template #caption>
                                <div class="flex justify-end">
                                    <p-iconfield iconPosition="left" class="ml-auto">
                                        <p-inputicon>
                                            <i class="pi pi-search"></i>
                                        </p-inputicon>
                                        <input pInputText type="text" (input)="rendezVousTable.filterGlobal($any($event.target).value, 'contains')" placeholder="Rechercher" />
                                    </p-iconfield>
                                </div>
                            </ng-template>

                            <ng-template #header>
                                <tr>
                                    <th pSortableColumn="date_rendez_vous">Date rendez-vous <p-sortIcon field="date_rendez_vous" /></th>
                                    <th>Informations</th>
                                    <th [style]="{ width: '20%' }">Client</th>
                                    <th [style]="{ width: '20%' }">Vehicule</th>
                                    <th>Etat</th>
                                    <th></th>
                                </tr>

                                <tr>
                                    <th></th>
                                    <th>
                                        <p-columnFilter type="text" field="titre" placeholder="Recherche par titre"></p-columnFilter>
                                    </th>
                                    <th>
                                        <p-columnFilter type="text" field="demande_rendez_vous.utilisateur.prenom,demande_rendez_vous.utilisateur.nom" placeholder="Rechercher client"></p-columnFilter>
                                    </th>

                                    <th>
                                        <p-columnFilter type="text" field="demande_rendez_vous.vehicule.immatriculation" placeholder="Rechercher par immatriculation"></p-columnFilter>
                                    </th>

                                    <th></th>

                                    <th></th>
                                </tr>
                            </ng-template>

                            <ng-template let-rendezVous #body>
                                <tr>
                                    <td>{{ rendezVous?.date_rendez_vous | date: 'yyyy-MM-dd HH:mm' }}</td>
                                    <td>
                                        <div class="flex flex-col gap-2">
                                            <div class="flex gap-2 items-center">
                                                <h5 class="m-0 p-0">{{ rendezVous?.demande_rendez_vous.titre }}</h5>
                                            </div>

                                            <p>{{ rendezVous?.demande_rendez_vous.description }}</p>

                                            <p-chip class="w-fit max-w-fit" [label]="rendezVous?.demande_rendez_vous.type_rendez_vous.designation" />
                                        </div>
                                    </td>

                                    <td>
                                        <div class="flex gap-4 align-middle items-center">
                                            <i class="pi pi-user"></i>

                                            <div class="flex flex-col gap-2">
                                                <div class="flex gap-2">
                                                    <p class="m-0 font-extrabold">{{ rendezVous?.demande_rendez_vous.utilisateur.nom }}</p>
                                                    <p class="m-0 font-extrabold">{{ rendezVous?.demande_rendez_vous.utilisateur.prenom }}</p>
                                                </div>

                                                <div class="flex gap-2">
                                                    <p class="m-0">{{ rendezVous?.demande_rendez_vous.utilisateur.telephone }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <div class="flex gap-4 align-middle items-center">
                                            <i class="pi pi-car"></i>

                                            <div class="flex flex-col gap-2">
                                                <p class="m-0 font-extrabold">{{ rendezVous?.demande_rendez_vous.vehicule.immatriculation }}</p>

                                                <div class="flex gap-2">
                                                    <p class="m-0">{{ rendezVous?.demande_rendez_vous.vehicule.modele }}</p>
                                                    <p class="m-0">{{ rendezVous?.demande_rendez_vous.vehicule.marque }}</p>
                                                    <p class="m-0">{{ rendezVous?.demande_rendez_vous.vehicule.annee }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <div class="flex flex-col gap-2 justify-start items-start">
                                            @if (!rendezVous?.demande_rendez_vous.intervention) {
                                                <p-badge [value]="'Ne possede pas une intervention'" [severity]="'warn'" />
                                            }
                                            <p-badge [value]="etatsService.getEtatRendezVous(rendezVous?.etat_rendez_vous).etatString" [severity]="etatsService.getEtatRendezVous(rendezVous?.etat_rendez_vous).etatColor" />
                                        </div>
                                    </td>

                                    <td>
                                        @if (rendezVous?.demande_rendez_vous.intervention) {
                                            <p-button label="Afficher Intervetion" [routerLink]="['/manager/intervention', rendezVous?.demande_rendez_vous.intervention]" />
                                        } @else {
                                            <p-button label="Assigner mecanicien" (onClick)="onAssignerMecanicien(rendezVous)" />
                                        }
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-card>
                </div>

                <div class="w-full">
                    <p-card header="Liste des interventions">
                        <p-table [value]="interventionData" [paginator]="true" [rows]="5" [loading]="isInterventionsLoading">
                            <ng-template #emptymessage>
                                <div class="p-3">
                                    <p>Aucune intervention trouvee</p>
                                </div>
                            </ng-template>

                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Vehicule</th>
                                    <th>Client</th>
                                    <th [style]="{ width: '20%' }" pSortableColumn="createdAt">Date Creation <p-sortIcon field="createdAt" /></th>
                                    <th [style]="{ width: '20%' }" pSortableColumn="date_debut">Date Debut <p-sortIcon field="date_debut" /></th>
                                    <th [style]="{ width: '3%' }">Devis</th>
                                    <th [style]="{ width: '3%' }">Facture</th>
                                    <th [style]="{ width: '20%' }">Etat</th>
                                    <th [style]="{ width: '20%' }"></th>
                                </tr>

                                <tr>
                                    <th>
                                        <p-columnFilter type="text" field="vehicule.immatriculation" placeholder="Rechercher vehicule"></p-columnFilter>
                                    </th>

                                    <th>
                                        <p-columnFilter type="text" field="intervention.utilisateur.nom,intervention.utilisateur.prenom"></p-columnFilter>
                                    </th>
                                    <th></th>
                                    <th></th>
                                    <th>
                                        <p-columnFilter [style]="{ width: '5%' }" type="text" field="devis.reference" placeholder="Rechercher reference"></p-columnFilter>
                                    </th>
                                    <th>
                                        <p-columnFilter [style]="{ width: '5%' }" type="text" field="facture.reference" placeholder="Rechercher reference"></p-columnFilter>
                                    </th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </ng-template>

                            <ng-template let-intervention #body>
                                <tr>
                                    <td>
                                        <div class="flex flex-col gap-2">
                                            <div class="flex gap-4 align-middle items-center">
                                                <i class="pi pi-car"></i>

                                                <div class="flex flex-col gap-2">
                                                    <p class="m-0 font-extrabold">{{ intervention.vehicule.immatriculation }}</p>

                                                    <div class="flex gap-2">
                                                        <p class="m-0">{{ intervention.vehicule.modele }}</p>
                                                        <p class="m-0">{{ intervention.vehicule.marque }}</p>
                                                        <p class="m-0">{{ intervention.vehicule.annee }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="flex flex-col gap-2">
                                            <div class="flex gap-4 align-middle items-center">
                                                <i class="pi pi-user"></i>

                                                <div class="flex flex-col gap-2">
                                                    <div class="flex flex-col gap-2">
                                                        <p class="m-0 font-extrabold">{{ intervention.utilisateur.nom }}</p>
                                                        <p class="m-0 font-extrabold">{{ intervention.utilisateur.prenom }}</p>
                                                    </div>

                                                    <div class="flex gap-2">
                                                        <p class="m-0">{{ intervention.utilisateur.telephone }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{{ intervention.createdAt | date: 'yyyy-MM-dd HH:mm' }}</td>
                                    <td>{{ (intervention.date_debut | date: 'yyyy-MM-dd HH:mm') ?? 'N/A' }}</td>
                                    <td>{{ intervention.devis?.reference ?? 'N/A' }}</td>
                                    <td>{{ intervention.facture?.reference ?? 'N/A' }}</td>
                                    <td>
                                        <p-badge [severity]="etatsService.getEtatIntervention(intervention.etat_intervention).etatColor" [value]="etatsService.getEtatIntervention(intervention.etat_intervention).etatString" />
                                    </td>
                                    <td>
                                        <p-button label="Plus de details" [routerLink]="['/manager/intervention', intervention._id]" />
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-card>
                </div>
            </div>
        </div>

        <p-dialog [(visible)]="isAssignerMecanicienVisible" [modal]="true" header="Assigner mecanicien" [style]="{ width: '50rem' }">
            <app-manager-assignation-rendez-vous (assignerMecanicienClicked)="onTryAssignerMecanicien($event)" />
        </p-dialog>
    `,
    styles: ``
})
export class ManagerTableauDeBordRemindersComponent {
    // Liste des rendez-vous su jour
    rendezVousJourData: any[] = [];
    rendezVousClicked: any = null;
    isAssignerMecanicienVisible: boolean = false;

    // Liste des interventions
    interventionData: any[] = [];

    etatsService: EtatsService = inject(EtatsService);

    // Loaders
    isInterventionsLoading : boolean = false
    isRendezVousLoading : boolean = false

    constructor(
        private rendezVousService: RendezVousService,
        private interventionService: InterventionService,
        private messageService: MessageService
    ) {
        this.fetchRendezVousJour();
        this.fetchInterventionJour();
    }

    fetchRendezVousJour() {
        this.isRendezVousLoading = true

        this.rendezVousService.getRendezVousDuJour().subscribe((response: any) => {
            this.rendezVousJourData = response.data;

            this.isRendezVousLoading = false
        });
    }

    fetchInterventionJour() {
        this.isInterventionsLoading = true

        this.interventionService.getInterventionsDuJour().subscribe((response: any) => {
            this.interventionData = response.data;

            this.isInterventionsLoading = false
        });
    }

    onAssignerMecanicien(rendezVous: any) {
        this.isAssignerMecanicienVisible = true;
        this.rendezVousClicked = rendezVous;
    }

    onTryAssignerMecanicien(idMecanicien: any) {
        if (!this.rendezVousClicked) return;

        this.rendezVousService.assignerMecanicien(this.rendezVousClicked._id, idMecanicien).subscribe({
            next: (response: any) => {
                this.isAssignerMecanicienVisible = false;

                this.fetchRendezVousJour();
                this.fetchInterventionJour();

                this.messageService.add({
                    summary: 'Assignation reussi',
                    detail: response.message,
                    severity: 'success'
                });
            },
            error: (err) => {
                this.messageService.add({
                    summary: 'Erreur',
                    detail: err.error.error,
                    severity: 'error'
                });
            }
        });
    }
}
