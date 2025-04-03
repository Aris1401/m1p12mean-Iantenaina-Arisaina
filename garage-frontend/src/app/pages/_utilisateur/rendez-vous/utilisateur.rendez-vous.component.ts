import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import {} from 'angular-calendar';
import { CardModule } from 'primeng/card';
import { CalendarHeaderComponent } from '../../utils/rendez-vous/calendar-header.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { endOfDay, endOfMonth, endOfWeek, format, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { TextareaModule } from 'primeng/textarea';
import { RendezVousService } from '../../../_services/rendez-vous/rendez-vous.service';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { VehiculeService } from '../../../_services/vehicule/vehicule.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { DataViewModule } from 'primeng/dataview';
import { UtilisateurRendezVousListeDemandeComponent } from './utilisateur.rendez-vous.liste-demande.component';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { forkJoin, Subject } from 'rxjs';

@Component({
    selector: 'app-utilisateur.rendez-vous',
    standalone: true,
    imports: [
        UtilisateurRendezVousListeDemandeComponent,
        TabsModule,
        DataViewModule,
        ToastModule,
        CalendarModule,
        CardModule,
        CalendarHeaderComponent,
        DialogModule,
        InputTextModule,
        FormsModule,
        CommonModule,
        TextareaModule,
        SelectModule,
        ButtonModule,
        ChipModule,
        DividerModule
    ],
    template: `
        <p-toast></p-toast>

        <p-card header="Mes rendez-vous">
            <p-tabs value="0">
                <p-tablist>
                    <p-tab value="0">Mon calendrier</p-tab>
                    <p-tab value="1">Mes demandes</p-tab>
                </p-tablist>

                <p-tabpanels>
                    <!-- Calendrier -->
                    <p-tabpanel value="0">
                        <app-calendar-header [(view)]="view" [(viewDate)]="viewDate" />

                        @if (view == 'week') {
                            <mwl-calendar-week-view
                                [events]="rendezVousEvents"
                                [refresh]="refreshCalendar"
                                [viewDate]="viewDate"
                                (dayHeaderClicked)="changeDay($event.day.date)"
                                (hourSegmentClicked)="onAddDemandeRendezVous($event.date)"
                                (eventClicked)="onEventRendezVousClicked($event.event)"
                            />
                        } @else if (view == 'day') {
                            <mwl-calendar-day-view [events]="rendezVousEvents" [refresh]="refreshCalendar" [viewDate]="viewDate" (hourSegmentClicked)="onAddDemandeRendezVous($event.date)" (eventClicked)="onEventRendezVousClicked($event.event)" />
                        } @else {
                            <mwl-calendar-month-view [events]="rendezVousEvents" [refresh]="refreshCalendar" [viewDate]="viewDate" (dayClicked)="changeDay($event.day.date)" (eventClicked)="onEventRendezVousClicked($event.event)" />
                        }
                    </p-tabpanel>

                    <!-- Demandes -->
                    <p-tabpanel value="1">
                        <app-utilisateur-rendez-vous-liste-demande />
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        </p-card>

        <!-- Details de rendez-vous -->
        <p-dialog header="Details rendez-vous" [(visible)]="isDetailsRendezVousVisible">
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

                <p-divider />

                <div class="flex gap-2 justify-between">
                    <p-chip class="w-fit" [label]="this.rendezVousClicked && getEtatRendezVous(this.rendezVousClicked.etat_rendez_vous)" />
                    <p-button label="Annuler" (onClick)="onAnnulerRendezVous(this.rendezVousClicked)" [loading]="isAnnulerLoading" />
                </div>
            </div>
        </p-dialog>

        <!-- Ajout de rendez-vous -->
        <p-dialog header="Ajouter un rendez-vous" [(visible)]="isAddRendezVousVisible" [style]="{ width: '30rem' }">
            <form class="flex flex-col gap-2" (submit)="onSubmitDemandeRendezVous()">
                <div class="w-full">
                    <label for="titre">Titre</label>
                    <input pInputText type="text" name="titre" id="titre" class="w-full" [(ngModel)]="rendezVousData.titre" />
                </div>

                <div class="w-full">
                    <label for="vehicule" class="block">Vehicule</label>
                    <p-select
                        [filter]="true"
                        [filterBy]="'immatriculation,marque,modele,annee'"
                        class="w-full"
                        [virtualScroll]="true"
                        [virtualScrollItemSize]="30"
                        [options]="vehiculesData"
                        optionLabel="immatriculation"
                        optionValue="_id"
                        name="vehicule"
                        [(ngModel)]="rendezVousData.vehicule"
                    >
                        <ng-template #item let-vehicule>
                            <div class="flex gap-4 align-middle items-center">
                                <i class="pi pi-car"></i>

                                <div class="flex flex-col gap-2">
                                    <p class="m-0 font-extrabold">{{ vehicule.immatriculation }}</p>

                                    <div class="flex gap-2">
                                        <p class="m-0">{{ vehicule.modele }}</p>
                                        <p class="m-0">{{ vehicule.marque }}</p>
                                        <p class="m-0">{{ vehicule.annee }}</p>
                                    </div>
                                </div>
                            </div>
                        </ng-template>
                    </p-select>
                </div>

                <div class="w-full">
                    <label for="date" class="block">Date</label>
                    <input pInputText type="datetime-local" name="date" id="date" class="w-full" [(ngModel)]="rendezVousData.date" />
                </div>

                <div class="w-full">
                    <label for="type" class="block">Type de rendez-vous</label>
                    <p-select [options]="typesRendezVousData" optionValue="_id" optionLabel="designation" name="type" id="type" [(ngModel)]="rendezVousData.type" class="w-full" />
                </div>

                <div class="w-full">
                    <label for="description" class="block">Description</label>
                    <textarea pTextarea name="description" id="description" rows="5" class="w-full" [(ngModel)]="rendezVousData.description"></textarea>
                </div>

                <p-button type="submit" label="Demander rendez-vous" class="w-full" [loading]="isAddLoading" />
            </form>
        </p-dialog>
    `,
    styles: ``
})
export class UtilisateurRendezVousComponent implements OnInit {
    view: CalendarView = CalendarView.Week;
    rendezVousEvents: CalendarEvent[] = [];
    viewDate = new Date();

    // Rendez vous modal
    isAddRendezVousVisible: boolean = false;
    rendezVousData: any = {
        titre: '',
        date: '',
        description: '',
        type: '',
        vehicule: ''
    };

    isAddLoading : boolean = false
    isAnnulerLoading : boolean = false

    typesRendezVousData: any[] = [];
    vehiculesData: any[] = [];

    // Details rendez vous
    isDetailsRendezVousVisible: boolean = false;
    rendezVousClicked: any;

    refreshCalendar = new Subject<void>();

    constructor(
        private rendezVousService: RendezVousService,
        private vehiculeService: VehiculeService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.rendezVousService.getTypesRendezVous().subscribe({
            next: (response: any) => {
                this.typesRendezVousData = response.data;
            }
        });

        this.vehiculeService.getVehicules().subscribe({
            next: (response: any) => {
                this.vehiculesData = response.data;
            }
        });

        this.obtenirRendezVousUtilisateur();
    }

    obtenirRendezVousUtilisateur() {
        // Ajouter message loading rendez vous
        this.messageService.add({
            summary: "Loading",
            detail: "Chargement des donnees de rendez-vous",
        })

        const getStart: any = {
            month: startOfMonth,
            week: startOfWeek,
            day: startOfDay
        }[this.view];

        const getEnd: any = {
            month: endOfMonth,
            week: endOfWeek,
            day: endOfDay
        }[this.view];

        this.rendezVousService.getRendezVousUtilisateur().subscribe({
            next: (response: any) => {
                const rendezVous = response.data;

                // Ajout des evenements
                this.rendezVousEvents = rendezVous.map((item: any) => {
                    return {
                        title: item.demande_rendez_vous.titre,
                        start: new Date(item.date_rendez_vous),
                        meta: {
                            rendezVous: item
                        }
                    };
                });

                // Obtenir les indisponibiltes
                this.rendezVousService.getIndisponibilites().subscribe({
                    next: (response: any) => {
                        const indisponibilite = response.data;

                        const indisponibiliteEvent = indisponibilite
                            .map((item: any) => {
                                return {
                                    titre: '',
                                    start: new Date(item.start),
                                    end: new Date(item.end),
                                    color: { primary: '#ff0000', secondary: '#FF6F6F' }
                                };
                            })
                            .flat();

                        this.rendezVousEvents = [...this.rendezVousEvents, ...indisponibiliteEvent];
                    }
                });
            }
        });
    }

    changeDay(date: any) {
        this.viewDate = date;
        this.view = CalendarView.Day;
    }

    onAddDemandeRendezVous(date: any) {
        this.isAddRendezVousVisible = true;

        this.rendezVousData.date = format(new Date(date), 'yyyy-MM-dd HH:mm');
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

    onAnnulerRendezVous(rendezVous: any) {
        this.isAnnulerLoading = true

        this.rendezVousService.annulerRendezVous(rendezVous._id).subscribe({
            next: (response: any) => {
                this.isDetailsRendezVousVisible = false;

                this.messageService.add({
                    severity: 'success',
                    summary: response.message
                });

                this.rendezVousEvents = this.rendezVousEvents.filter((event: any) => event._id != rendezVous._id);

                this.isAnnulerLoading = false

                this.refreshCalendar.next();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: err.error.error
                });

                this.isAnnulerLoading = false
            }
        });
    }

    onSubmitDemandeRendezVous() {
        this.isAddLoading = true

        this.rendezVousService.addDemandeRendezVous(this.rendezVousData).subscribe({
            next: (response: any) => {
                this.isAddLoading = false

                this.messageService.add({
                    severity: 'success',
                    summary: response.message + ". Apres avoir actualiser la page veuillez verifier dans l'onglet des demandes."
                });

                this.rendezVousData = {
                    titre: '',
                    date: '',
                    description: '',
                    type: '',
                    vehicule: ''
                };

                this.isAddRendezVousVisible = false;

                // this.obtenirRendezVousUtilisateur()
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: err.error.error
                });

                this.isAddLoading = false
            }
        });
    }

    onEventRendezVousClicked(event: CalendarEvent<any>) {
        if (event.meta && event.meta.rendezVous) {
            this.isDetailsRendezVousVisible = true;
            this.rendezVousClicked = event.meta.rendezVous;
        }
    }
}
