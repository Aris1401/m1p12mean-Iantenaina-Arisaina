import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import {} from 'angular-calendar';
import { CardModule } from 'primeng/card';
import { CalendarHeaderComponent } from '../../utils/rendez-vous/calendar-header.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';
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

@Component({
    selector: 'app-utilisateur.rendez-vous',
	standalone: true,
    imports: [UtilisateurRendezVousListeDemandeComponent, TabsModule, DataViewModule, ToastModule, CalendarModule, CardModule, CalendarHeaderComponent, DialogModule, InputTextModule, FormsModule, CommonModule, TextareaModule, SelectModule, ButtonModule],
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
							 <mwl-calendar-week-view [events]="rendezVousEvents" [viewDate]="viewDate" (dayHeaderClicked)="changeDay($event.day.date)" (hourSegmentClicked)="onAddDemandeRendezVous($event.date)" />
						 } @else if (view == 'day') {
							 <mwl-calendar-day-view [events]="rendezVousEvents" [viewDate]="viewDate" (hourSegmentClicked)="onAddDemandeRendezVous($event.date)" />
						 } @else {
							 <mwl-calendar-month-view [events]="rendezVousEvents" [viewDate]="viewDate" (dayClicked)="changeDay($event.day.date)" />
						 }
					 </p-tabpanel>

					 <!-- Demandes -->
					  <p-tabpanel value="1">
						<app-utilisateur-rendez-vous-liste-demande />
					  </p-tabpanel>
				</p-tabpanels>
			</p-tabs>

        </p-card>

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
                    <input pInputText type="datetime-local" name="date" id="date" class="w-full" [(ngModel)]="rendezVousData.date" disabled />
                </div>

                <div class="w-full">
                    <label for="type" class="block">Type de rendez-vous</label>
                    <p-select [options]="typesRendezVousData" optionValue="_id" optionLabel="designation" name="type" id="type" [(ngModel)]="rendezVousData.type" class="w-full" />
                </div>

                <div class="w-full">
                    <label for="description" class="block">Description</label>
                    <textarea pTextarea name="description" id="description" rows="5" class="w-full" [(ngModel)]="rendezVousData.description"></textarea>
                </div>

                <p-button type="submit" label="Demander rendez-vous" class="w-full" />
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

    typesRendezVousData: any[] = [];
    vehiculesData: any[] = [];

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
    }

    changeDay(date: any) {
        this.viewDate = date;
        this.view = CalendarView.Day;
    }

    onAddDemandeRendezVous(date: any) {
        this.isAddRendezVousVisible = true;

        this.rendezVousData.date = format(new Date(date), 'yyyy-MM-dd HH:mm');
    }

    onSubmitDemandeRendezVous() {
        console.log(JSON.stringify(this.rendezVousData));
        this.rendezVousService.addDemandeRendezVous(this.rendezVousData).subscribe({
            next: (response: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: response.message
                });

                this.rendezVousData = {
                    titre: '',
                    date: '',
                    description: '',
                    type: '',
                    vehicule: ''
                };

				this.isAddRendezVousVisible = false
            },
			error: (err) => {
				this.messageService.add({
					severity: 'error',
					summary: err.error.error
				})
			}
        });
    }
}
