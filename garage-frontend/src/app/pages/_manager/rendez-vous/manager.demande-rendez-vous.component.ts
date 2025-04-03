import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import { CardModule } from 'primeng/card';
import { CalendarHeaderComponent } from '../../utils/rendez-vous/calendar-header.component';
import { RendezVousService } from '../../../_services/rendez-vous/rendez-vous.service';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ManagerAssignationRendezVousComponent } from './manager.assignation-rendez-vous.component';
import { DataViewModule } from 'primeng/dataview';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-manager.demande-rendez-vous',
    standalone: true,
    imports: [CardModule, CalendarHeaderComponent, RouterModule, CalendarModule, ButtonModule, ChipModule, DialogModule, DividerModule, CommonModule, ToastModule, ManagerAssignationRendezVousComponent, DataViewModule],
    template: `
        <p-toast></p-toast>

        <p-card>
            <app-calendar-header [(view)]="view" [(viewDate)]="viewDate" />

            @if (view == 'week') {
                <mwl-calendar-week-view
                    [events]="rendezVousEvents"
                    [viewDate]="viewDate"
                    (dayHeaderClicked)="changeDay($event.day.date)"
                    (hourSegmentClicked)="onAddDemandeRendezVous($event.date)"
                    (eventClicked)="onEventRendezVousClicked($event.event)"
                />
            } @else if (view == 'day') {
                <mwl-calendar-day-view [events]="rendezVousEvents" [viewDate]="viewDate" (hourSegmentClicked)="onAddDemandeRendezVous($event.date)" (eventClicked)="onEventRendezVousClicked($event.event)" />
            } @else {
                <mwl-calendar-month-view [events]="rendezVousEvents" [viewDate]="viewDate" (dayClicked)="changeDay($event.day.date)" (eventClicked)="onEventRendezVousClicked($event.event)" />
            }
        </p-card>

        <!-- Details de rendez-vous -->
        <p-dialog header="Details rendez-vous" [(visible)]="isDetailsRendezVousVisible">
            <div class="flex gap-2">
                <div class="flex flex-col gap-2">
                    <div class="flex flex-col gap-2">
                        <div class="flex gap-2 items-center">
                            <h5 class="m-0 p-0">{{ this.rendezVousClicked && this.rendezVousClicked.demande_rendez_vous.titre }}</h5>
                            <p-chip class="text-sm" [label]="this.rendezVousClicked && (this.rendezVousClicked.date_rendez_vous | date: 'yyyy-MM-dd HH:mm')" />
                        </div>

                        <p>{{ this.rendezVousClicked && this.rendezVousClicked.demande_rendez_vous.description }}</p>

                        <p-chip class="w-fit max-w-fit" [label]="this.rendezVousClicked && this.rendezVousClicked.demande_rendez_vous.type_rendez_vous.designation" />
                    </div>

                    <p-divider />

                    <div class="flex flex-col gap-2">
                        <div class="flex gap-4 align-middle items-center">
                            <i class="pi pi-car"></i>

                            <div class="flex flex-col gap-2">
                                <p class="m-0 font-extrabold">{{ this.rendezVousClicked && this.rendezVousClicked.demande_rendez_vous.vehicule.immatriculation }}</p>

                                <div class="flex gap-2">
                                    <p class="m-0">{{ this.rendezVousClicked && this.rendezVousClicked.demande_rendez_vous.vehicule.modele }}</p>
                                    <p class="m-0">{{ this.rendezVousClicked && this.rendezVousClicked.demande_rendez_vous.vehicule.marque }}</p>
                                    <p class="m-0">{{ this.rendezVousClicked && this.rendezVousClicked.demande_rendez_vous.vehicule.annee }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <div class="flex gap-4 align-middle items-center">
                            <i class="pi pi-user"></i>

                            <div class="flex flex-col gap-2">
                                <div class="flex gap-2">
                                    <p class="m-0 font-extrabold">{{ this.rendezVousClicked && this.rendezVousClicked.demande_rendez_vous.utilisateur.nom }}</p>
                                    <p class="m-0 font-extrabold">{{ this.rendezVousClicked && this.rendezVousClicked.demande_rendez_vous.utilisateur.prenom }}</p>
                                </div>

                                <div class="flex gap-2">
                                    <p class="m-0">{{ this.rendezVousClicked && this.rendezVousClicked.demande_rendez_vous.utilisateur.telephone }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p-divider />

                    <div class="flex gap-2 justify-between">
                        <p-chip class="w-fit" [label]="this.rendezVousClicked && getEtatRendezVous(this.rendezVousClicked.etat_rendez_vous)" />

                        @if (this.rendezVousClicked?.demande_rendez_vous.intervention) {
                            <p-button label="Afficher intervention" [routerLink]="['/manager/intervention', this.rendezVousClicked?.demande_rendez_vous.intervention?._id]" />
                        }
                    </div>
                </div>

                <p-divider layout="vertical" />

                <div class="flex flex-col gap-2">
                    <div class="flex flex-col">
                        <h4>Mecaniciens</h4>

                        <p-button label="Assigner mecanicien" icon="pi pi-plus" (onClick)="onAssignerMecanicien()" />
                    </div>

                    <p-data-view [value]="mecanicienAssignerData">
                        <ng-template #header>
                            @if (isMecanicienAssignerLoading) {
                                <div class="flex p-3 items-center gap-2">
                                    <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                                    <p>Chargement des mecaniciens assigner</p>
                                </div>
                            }
                        </ng-template>

                        <ng-template #list let-mecaniciens>
                            <div class="flex flex-col gap-2">
                                @for (mecanicien of mecaniciens; track mecanicien._id) {
                                    <p-card>
                                        <div class="flex gap-2 items-center">
                                            <i class="pi pi-wrench"></i>

                                            <div class="flex flex-col">
                                                <p class="uppercase m-0">{{ mecanicien?.mecanicien?.nom }}</p>
                                                <p class="m-0">{{ mecanicien?.mecanicien?.prenom }}</p>
                                            </div>
                                        </div>
                                    </p-card>
                                }
                            </div>
                        </ng-template>
                    </p-data-view>
                </div>
            </div>
        </p-dialog>

        <!-- Details demande rendez-vous -->
        <p-dialog header="Details demande rendez-vous" [(visible)]="isDetailsDemandeRendezVousVisible">
            <!-- Details rendez vous -->
            <div class="flex flex-col gap-2">
                <div class="flex flex-col gap-2">
                    <div class="flex gap-2 items-center">
                        <h5 class="m-0 p-0">{{ this.demandeRendezVousClicked && this.demandeRendezVousClicked.titre }}</h5>
                        <p-chip class="text-sm" [label]="this.demandeRendezVousClicked && (this.demandeRendezVousClicked.date_souhaiter | date: 'yyyy-MM-dd HH:mm')" />
                    </div>

                    <p>{{ this.demandeRendezVousClicked && this.demandeRendezVousClicked.description }}</p>

                    <p-chip class="w-fit max-w-fit" [label]="this.demandeRendezVousClicked && this.demandeRendezVousClicked.type_rendez_vous.designation" />
                </div>

                <p-divider />

                <div class="flex flex-col gap-2">
                    <div class="flex gap-4 align-middle items-center">
                        <i class="pi pi-car"></i>

                        <div class="flex flex-col gap-2">
                            <p class="m-0 font-extrabold">{{ this.demandeRendezVousClicked && this.demandeRendezVousClicked.vehicule.immatriculation }}</p>

                            <div class="flex gap-2">
                                <p class="m-0">{{ this.demandeRendezVousClicked && this.demandeRendezVousClicked.vehicule.modele }}</p>
                                <p class="m-0">{{ this.demandeRendezVousClicked && this.demandeRendezVousClicked.vehicule.marque }}</p>
                                <p class="m-0">{{ this.demandeRendezVousClicked && this.demandeRendezVousClicked.vehicule.annee }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <div class="flex gap-4 align-middle items-center">
                        <i class="pi pi-user"></i>

                        <div class="flex flex-col gap-2">
                            <div class="flex gap-2">
                                <p class="m-0 font-extrabold">{{ this.demandeRendezVousClicked && this.demandeRendezVousClicked.utilisateur.nom }}</p>
                                <p class="m-0 font-extrabold">{{ this.demandeRendezVousClicked && this.demandeRendezVousClicked.utilisateur.prenom }}</p>
                            </div>

                            <div class="flex gap-2">
                                <p class="m-0">{{ this.demandeRendezVousClicked && this.demandeRendezVousClicked.utilisateur.telephone }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p-divider />

                <div class="flex gap-2 justify-between">
                    <p-chip class="w-fit" [label]="this.demandeRendezVousClicked && getEtatDemandeRendezVous(this.demandeRendezVousClicked.etat_demande)" />
                    <p-button label="Accepter" (onClick)="onAccepterDemande(this.demandeRendezVousClicked._id)" [loading]="isAccepterLoading" />
                </div>
            </div>
        </p-dialog>

        <p-dialog [(visible)]="isAssignerMecanicienVisible" [modal]="true" header="Assigner mecanicien" [style]="{ width: '50rem' }">
            <app-manager-assignation-rendez-vous (assignerMecanicienClicked)="onTryAssignerMecanicien($event)" />
        </p-dialog>
    `,
    styles: ``
})
export class ManagerDemandeRendezVousComponent implements OnInit {
    view: CalendarView = CalendarView.Week;
    rendezVousEvents: CalendarEvent[] = [];
    viewDate = new Date();

    // Details rendez vous
    isDetailsRendezVousVisible: boolean = false;
    rendezVousClicked: any;

    // Details rendez vous
    isDetailsDemandeRendezVousVisible: boolean = false;
    demandeRendezVousClicked: any;

    // Assignation de mecanicien
    isAssignerMecanicienVisible: boolean = false;
    mecanicienAssignerData: any[] = [];

    // Loaders
    isAccepterLoading : boolean = false

    isMecanicienAssignerLoading: boolean = false;

    constructor(
        private rendezVousService: RendezVousService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.rendezVousEvents = [];

        this.rendezVousService.getDemandesRendezVousManager().subscribe({
            next: (response: any) => {
                const events = response.data.map((demande: any) => {
                    return {
                        title: 'Demande - ' + demande.titre,
                        start: new Date(demande.date_souhaiter),
                        color: { primary: '#ffe6c7', secondary: '#ffe6c7' },
                        meta: {
                            demandeRendezVous: demande
                        }
                    };
                });

                this.rendezVousEvents = [...this.rendezVousEvents, ...events];
            }
        });

        this.rendezVousService.getRendezVousManager().subscribe((rendezVous: any) => {
            const events = rendezVous.data.map((rdv: any) => {
                return {
                    title: rdv.demande_rendez_vous.titre,
                    start: new Date(rdv.date_rendez_vous),
                    meta: {
                        rendezVous: rdv
                    }
                };
            });

            this.rendezVousEvents = [...this.rendezVousEvents, ...events];
        });
    }

    fetchMecanicienAssigner(idRendezVous: any) {
        this.isMecanicienAssignerLoading = true;

        this.rendezVousService.getMecanicienAssigner(idRendezVous).subscribe({
            next: (response: any) => {
                this.mecanicienAssignerData = response.data;

                this.isMecanicienAssignerLoading = false;
            }
        });
    }

    changeDay(date: any) {
        this.viewDate = date;
        this.view = CalendarView.Day;
    }

    onEventRendezVousClicked(event: any) {
        if (event.meta && event.meta.rendezVous) {
            this.isDetailsRendezVousVisible = true;
            this.rendezVousClicked = event.meta.rendezVous;
            this.fetchMecanicienAssigner(this.rendezVousClicked._id);
        }

        if (event.meta && event.meta.demandeRendezVous) {
            this.isDetailsDemandeRendezVousVisible = true;
            this.demandeRendezVousClicked = event.meta.demandeRendezVous;
        }
    }

    onAddDemandeRendezVous(date: any) {
        console.log(date);
    }

    onAssignerMecanicien() {
        this.isAssignerMecanicienVisible = true;
    }

    // Lorsque l'utilisateur assigne un mecanicien
    onTryAssignerMecanicien(idMecanicien: any) {
        if (!this.rendezVousClicked) return;

        this.messageService.add({
            summary: "En cours",
            detail: "En cours d'assignation de mecanicien"
        })

        this.rendezVousService.assignerMecanicien(this.rendezVousClicked._id, idMecanicien).subscribe({
            next: (response: any) => {
                this.isAssignerMecanicienVisible = false;

                this.fetchMecanicienAssigner(this.rendezVousClicked._id);

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

    getEtatRendezVous(etat_rendez_vous: any) {
        if (etat_rendez_vous == 0) {
            return 'En attente';
        } else if (etat_rendez_vous == 10) {
            return 'En cours';
        } else if (etat_rendez_vous == 20) {
            return 'Fini';
        } else {
            return 'Annuler';
        }
    }

    getEtatDemandeRendezVous(etat_rendez_vous: any) {
        if (etat_rendez_vous == 0) {
            return 'En attente';
        } else if (etat_rendez_vous == 10) {
            return 'Accepter';
        } else {
            return 'Refuser';
        }
    }

    onAccepterDemande(idDemande: any) {
        this.isAccepterLoading = true

        this.rendezVousService.validerDemandeRendezVousManager(idDemande).subscribe({
            next: (response: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Demande rendez-vous',
                    detail: response.message
                });

                this.isDetailsDemandeRendezVousVisible = false;

                this.isAccepterLoading = false

                this.ngOnInit();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Demande rendez-vous',
                    detail: err.error.error
                });

                this.isAccepterLoading = false
            }
        });
    }
}
