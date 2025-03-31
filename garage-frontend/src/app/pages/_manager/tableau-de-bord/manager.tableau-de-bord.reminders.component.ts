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

@Component({
    selector: 'app-manager-tableau-de-bord-reminders',
    standalone: true,
    imports: [CardModule, TableModule, CommonModule, ChipModule, DialogModule, BadgeModule, ButtonModule, DialogModule, ManagerAssignationRendezVousComponent, RouterModule, InputTextModule, IconFieldModule, InputIconModule],
    template: `
        <p-dialog></p-dialog>

        <div class="flex flex-col gap-2">
            <div class="flex gap-2">
                <div class="w-full">
                    <p-card header="Rendez-Vous du jour">
                        <p-table [value]="rendezVousJourData" #rendezVousTable [paginator]="true" [rows]="5" [globalFilterFields]="['demande_rendez_vous.titre', 'demande_rendez_vous.description', 'demande_rendez_vous.utilisateur.nom', 'demande_rendez_vous.utilisateur.prenom', 'demande_rendez_vous.vehicule.immatriculation', 'demande_rendez_vous.vehicule.modele', 'demande_rendez_vous.vehicule.marque', 'demande_rendez_vous.vehicule.annee']">
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

    etatsService: EtatsService = inject(EtatsService);

    constructor(
        private rendezVousService: RendezVousService,
        private messageService: MessageService
    ) {
        this.fetchRendezVousJour();
    }

    fetchRendezVousJour() {
        this.rendezVousService.getRendezVousDuJour().subscribe((response: any) => {
            this.rendezVousJourData = response.data;
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
