import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart'
import { ManagerStatistiquesService } from '../../../_services/manager/manager.statistiques.service';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-manager.tableau-de-bord',
  imports: [CardModule, ChartModule, SelectModule],
  template: `
    <p-card>
      <p-select [options]="anneesOptions" (onChange)="onAnneeSelected($event.value)" />
      <p-chart type="line" [data]="chartData" class="h-[10rem]"></p-chart>
    </p-card>
  `,
  styles: ``
})
export class ManagerTableauDeBordComponent implements OnInit {
  chartData : any = { labels: [], datasets: [] }
  chartOptions : any[] = []

  anneesOptions : any[] = []

  constructor (
    private managerStatistiquesService : ManagerStatistiquesService
  ) {}

  ngOnInit(): void {
      this.managerStatistiquesService.getAnnees().subscribe({
        next: (response : any) => {
          this.anneesOptions = response.data.map((annee : any) => {
            return {
              value: annee,
              label: annee
            }
          })
        }
      })

      this.initializeGraphs(new Date().getFullYear())
  }

  onAnneeSelected(annee : any) {
    this.initializeGraphs(annee)
  }

  initializeGraphs(year : any) {
    this.chartData = { labels: [], datasets: [] }

    this.managerStatistiquesService.getMois().subscribe({
      next: (response : any) => {
        this.chartData.labels = response.data
      }
    })

    this.managerStatistiquesService.getRendezVous().subscribe({
      next: (response : any) => {
        const dataFini = response.data.fini.map((item : any) => {
          return item.count
        })

        const dataEnAttente = response.data.en_attente.map((item : any) => {
          return item.count
        })

        const dataset = {
          label: "Nombre rendez-vous (Fini)",
          data: dataFini
        }

        const datasetEnAttente = {
          label: "Nombre rendez-vous (En attente)",
          data: dataEnAttente
        }

        this.chartData.datasets.push(dataset)
        this.chartData.datasets.push(datasetEnAttente)
      }
    })
  }
}
