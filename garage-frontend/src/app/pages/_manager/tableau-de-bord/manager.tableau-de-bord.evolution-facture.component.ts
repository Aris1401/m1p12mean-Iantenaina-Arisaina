import { Component, effect, input, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { ManagerStatistiquesService } from '../../../_services/manager/manager.statistiques.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
    selector: 'app-manager-tableau-de-bord-evolution-facture',
    imports: [CardModule, ChartModule, SelectButtonModule, DropdownModule, FormsModule, CommonModule],
    template: `
        <p-card header="Évolution des factures TTC">
            <div class="flex flex-wrap gap-3 mb-4">
                <div class="flex gap-2 items-center">
                    <label for="mois" class="mb-1">Mois</label>
                    <p-dropdown id="mois" [options]="mois" [(ngModel)]="moisSelectionne" placeholder="Sélectionner un mois" (onChange)="onSelectionChange()" optionLabel="nom" optionValue="valeur"></p-dropdown>
                </div>

                <div class="flex gap-2 items-center">
                    <label for="vueType" class="mb-1">Type d'affichage</label>
                    <p-selectButton id="vueType" [options]="typesVue" [(ngModel)]="typeVueSelectionne" (onChange)="onSelectionChange()" optionLabel="label" optionValue="value"></p-selectButton>
                </div>
            </div>

            
                <p-chart type="line" #evolutionChart [data]="chartData" [options]="chartOptions" class="w-full h-full"></p-chart>
            
        </p-card>
    `,
    styles: ``
})
export class ManagerTableauDeBordEvolutionFactureComponent {
    mois: any[] = [
        { nom: 'Janvier', valeur: 1 },
        { nom: 'Février', valeur: 2 },
        { nom: 'Mars', valeur: 3 },
        { nom: 'Avril', valeur: 4 },
        { nom: 'Mai', valeur: 5 },
        { nom: 'Juin', valeur: 6 },
        { nom: 'Juillet', valeur: 7 },
        { nom: 'Août', valeur: 8 },
        { nom: 'Septembre', valeur: 9 },
        { nom: 'Octobre', valeur: 10 },
        { nom: 'Novembre', valeur: 11 },
        { nom: 'Décembre', valeur: 12 }
    ];
    annee: any = input(new Date().getFullYear());
    typesVue: any[] = [
        { label: 'Quotidien', value: 'quotidien' },
        { label: 'Cumulatif', value: 'cumulatif' }
    ];

    // Select values
    moisSelectionne: any = new Date().getMonth() + 1;
    typeVueSelectionne: any = 'quotidien';

    donnees: any = [];
    chargementEnCours: boolean = false;

    @ViewChild('evolutionChart') evolutionChart : any
    chartData: any = null;
    chartOptions: any = {
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context: any) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += this.formatAriary(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };

    constructor(private statistiqueService: ManagerStatistiquesService) {
        this.fetchEvolutionData(this.annee(), this.moisSelectionne);

        effect(() => {
          // This will run whenever annee() changes
          const currentAnnee = this.annee();
          this.fetchEvolutionData(currentAnnee, this.moisSelectionne);
      });
    }

    fetchEvolutionData(annee: any, mois: any) {
        this.statistiqueService.getEvolutionFacture(annee, mois).subscribe((reponse: any) => {
            this.donnees = reponse.data;

          
                this.mettreAJourGraphique();
            

            this.chargementEnCours = false;

            this.evolutionChart.refresh()
        });
    }

    mettreAJourGraphique() {
        if (!this.donnees) return;

        // Formater les dates pour l'affichage
        const labels = this.donnees.dates;

        // Sélectionner les données en fonction du type d'affichage
        const datasetValue = this.typeVueSelectionne === 'quotidien' ? this.donnees.totalTTC : this.donnees.cumulTTC;

        const datasetLabel = this.typeVueSelectionne === 'quotidien' ? 'Montant TTC journalier' : 'Montant TTC cumulé';

        // Configuration du graphique
        this.chartData = {
            labels: labels,
            datasets: [
                {
                    label: datasetLabel,
                    data: datasetValue,
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.3
                }
            ]
        };
    }

    onSelectionChange() {
        this.fetchEvolutionData(this.annee(), this.moisSelectionne);
    }

    formatAriary(valeur: number, compact: boolean = false): string {
      if (valeur === null || valeur === undefined) return '-';
      
      // Format compact pour les grands nombres sur les axes
      if (compact && valeur >= 1000000) {
        return (valeur / 1000000).toFixed(1) + ' M Ar';
      } else if (compact && valeur >= 1000) {
        return (valeur / 1000).toFixed(1) + ' k Ar';
      }
      
      // Format complet pour les autres cas
      return new Intl.NumberFormat('fr-MG', {
        style: 'currency',
        currency: 'MGA',
        currencyDisplay: 'symbol',
        maximumFractionDigits: 0
      }).format(valeur);
    }
}
