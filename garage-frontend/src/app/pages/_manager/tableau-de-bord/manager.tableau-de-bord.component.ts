import { Component, OnInit, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ManagerStatistiquesService } from '../../../_services/manager/manager.statistiques.service';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { ManagerTableauDeBordRemindersComponent } from './manager.tableau-de-bord.reminders.component';
import { ManagerTableauDeBordEvolutionFactureComponent } from './manager.tableau-de-bord.evolution-facture.component';

@Component({
    selector: 'app-manager.tableau-de-bord',
    standalone: true,
    imports: [CardModule, ChartModule, SelectModule, DividerModule, ManagerTableauDeBordRemindersComponent, ManagerTableauDeBordEvolutionFactureComponent],
    template: `
        <div class="mb-2 flex justify-end block">
            <p-select [options]="anneesOptions" (onChange)="onAnneeSelected($event.value)" />
        </div>

        <div class="flex flex-col gap-2">
            <div class="flex gap-5">
                <!-- Nombre de demande rendez-vous -->
                <div class="card mb-0">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">Demandes de <br />rendez-vous du jour</span>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ nombreDemandeData?.nombre ?? 0 }}</div>
                        </div>
                        <div class="flex items-center ml-3 justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-users text-cyan-500 !text-xl"></i>
                        </div>
                    </div>
                    <span class="text-primary font-medium">{{ nombreDemandeData?.annuler ?? 0 }} </span>
                    <span class="text-muted-color">Annuler</span>
                </div>
                <!-- Nombre de rendez-vous -->
                <div class="card mb-0">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">Nombre de rendez-vous<br />du jour</span>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ nombreRendezVousData?.nombre ?? 0 }}</div>
                        </div>
                        <div class="flex items-center ml-3 justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-users text-cyan-500 !text-xl"></i>
                        </div>
                    </div>
                    <span class="text-primary font-medium">{{ nombreRendezVousData?.annuler ?? 0 }} </span>
                    <span class="text-muted-color">Annuler</span>
                </div>

                <!-- Chiffre d'affaire du jour -->
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div class="card mb-0">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4">Chiffre d'affaire<br />du jour (TTC)</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalFactureJourData?.total_ttc ?? 0 }} Ar</div>
                            </div>
                            <div class="flex items-center ml-3 justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">{{ (totalFactureJourData?.signe ?? '') + (totalFactureJourData?.growthPercentageTTC ?? 0) }}% </span>
                        <span class="text-muted-color">depuis hier</span>
                    </div>
                </div>

                <!-- Chiffre d'affaire de l'annee -->
                <div class="col-span-12 lg:col-span-6 xl:col-span-3">
                    <div class="card mb-0">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4">Chiffre d'affaire<br />de l'annee (TTC)</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalFactureAnneeData?.total_ttc ?? 0 }} Ar</div>
                            </div>
                            <div class="flex items-center ml-3 justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                            </div>
                        </div>
                        <span class="text-primary font-medium">{{ (totalFactureAnneeData?.signe ?? '') + (totalFactureAnneeData?.growthPercentageTTC ?? 0) }}% </span>
                        <span class="text-muted-color">depuis l'annee derniere</span>
                    </div>
                </div>
            </div>

            <!-- Nombre des rendez-vous -->
            <div class="flex gap-2 items-stretch">
                <div class="w-1/2 h-full">
                    <p-card header="Nomdre de rendez-vous">
                        <p-chart type="line" [data]="chartData" #rendezVousChart class="w-full"></p-chart>
                    </p-card>
                </div>

                <div class="w-1/2 h-full flex-1">
                    <app-manager-tableau-de-bord-evolution-facture [annee]="anneeSelected" />
                </div>
            </div>
        </div>

        <p-divider></p-divider>

        <app-manager-tableau-de-bord-reminders />
    `,
    styles: ``
})
export class ManagerTableauDeBordComponent implements OnInit {
    // Rendez vous chart
    @ViewChild('rendezVousChart') rendezVousChart: any;

    chartData: any = { labels: [], datasets: [] };
    chartOptions: any[] = [];

    anneesOptions: any[] = [];
    anneeSelected: any = new Date().getFullYear();

    // Total facture data
    totalFactureAnneeData: any;
    totalFactureJourData: any;

    // Nombre de demande de rendez-vous
    nombreDemandeData: any;

    // Nombre de rendez-vois
    nombreRendezVousData: any;

    constructor(private managerStatistiquesService: ManagerStatistiquesService) {}

    ngOnInit(): void {
        this.managerStatistiquesService.getAnnees().subscribe({
            next: (response: any) => {
                this.anneesOptions = response.data.map((annee: any) => {
                    return {
                        value: annee,
                        label: annee
                    };
                });
            }
        });

        this.initializeGraphs(new Date().getFullYear());
        this.fetchTotalFacture(new Date().getFullYear());
        this.fetchNombreDemandeRendezVous();
    }

    onAnneeSelected(annee: any) {
        this.initializeGraphs(annee);
        this.fetchTotalFacture(annee);

        this.anneeSelected = annee;
    }

    initializeGraphs(year: any) {
        this.chartData = { labels: [], datasets: [] };

        this.managerStatistiquesService.getMois().subscribe({
            next: (response: any) => {
                this.chartData.labels = [...response.data];
            }
        });

        this.managerStatistiquesService.getRendezVous(year).subscribe({
            next: (response: any) => {
                const dataFini = response.data.fini.map((item: any) => {
                    return item.count;
                });

                const dataEnAttente = response.data.en_attente.map((item: any) => {
                    return item.count;
                });

                const dataset = {
                    label: 'Nombre rendez-vous (Fini)',
                    data: dataFini,
                    tension: 0.3
                };

                const datasetEnAttente = {
                    label: 'Nombre rendez-vous (En attente)',
                    data: dataEnAttente,
                    tension: 0.3
                };

                this.chartData.datasets.push(dataset);
                this.chartData.datasets.push(datasetEnAttente);

                this.rendezVousChart.refresh();
            }
        });
    }

    fetchTotalFacture(annee: any) {
        this.managerStatistiquesService.getTotalFactureAnnee(annee).subscribe((response: any) => {
            this.totalFactureAnneeData = response.data;
        });

        this.managerStatistiquesService.getTotalFactureJour().subscribe((response: any) => {
            this.totalFactureJourData = response.data;
        });
    }

    fetchNombreDemandeRendezVous() {
        this.managerStatistiquesService.getNombreDemandeRendezVous().subscribe((response: any) => {
            this.nombreDemandeData = response.data;
        });
    }

    fetchNombreRendezVous() {
        this.managerStatistiquesService.getNombreRendezVous().subscribe((response: any) => {
            this.nombreRendezVousData = response.data;
        });
    }
}
