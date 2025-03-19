import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-utilisateur-vehicules-intervetions',
  imports: [CardModule, TableModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, RouterModule],
  template: `
    @if (interventions.length > 0) {
      <p-card header="Intervention courante">
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <p>Devis: DEV123</p>
            <p>Facture: FAC123</p>
          </div>
          <p>Etat: En cours</p>
          <div>
            <button pButton label="Afficher details" type="button" icon="pi pi-eye" class="p-button-rounded p-button-text" [routerLink]="['/intervention', interventions[0]._id]"></button>
          </div>
    </div>
      </p-card>
    }

    <div class="mt-2">
      <p-card header="Liste des interventions">
        <p-table [value]="interventions" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[5, 10, 20]">
          <ng-template #caption>
            <div class="flex justify-end">
              <p-iconField>
                <p-inputIcon>
                  <i class="pi pi-search"></i>
                </p-inputIcon>
                <input pInputText type="text" placeholder="Rechercher" />
              </p-iconField>
            </div>
            </ng-template>

          <ng-template #header>
            <tr>
              <th pSortableColumn="createdAt">
                Date intervention <p-sortIcon field="createdAt"></p-sortIcon>
              </th>
              <th pSortableColumn="date_debut">
                Date debut intervention <p-sortIcon field="date_debut"></p-sortIcon>
              </th>
              <th>Devis</th>
              <th>Facture</th>
              <th pSortableColumn="etat_intervention">
                Statut <p-sortIcon field="etat_intervention"></p-sortIcon>
              </th>
              <th></th>
            </tr>
          </ng-template>

          <ng-template let-intervention #body>
            <tr>
              <td>{{ intervention.createdAt }}</td>
              <td>{{ intervention.date_debut || "N/A" }}</td>
              <td>{{ intervention.devis.reference }}</td>
              <td>{{ intervention.facture.reference }}</td>
              <td>{{ intervention.etat_intervention }}</td>
              <td>
                <button pButton label="Afficher details" type="button" icon="pi pi-eye" class="p-button-rounded p-button-text" [routerLink]="['/intervention', intervention._id]"></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: ``
})
export class UtilisateurVehiculesIntervetionsComponent {
  vehiculeId = input()

  interventions = [
    {
      _id: '1',
      createdAt: '2023-01-01',
      etat_intervention: 'En cours',
      devis: { reference: 'DEV123' },
      facture: { reference: 'FAC123' }
    },
    {
      _id: '2',
      createdAt: '2023-02-01',
      etat_intervention: 'Terminé',
      devis: { reference: 'DEV124' },
      facture: { reference: 'FAC124' }
    },
    {
      _id: '3',
      createdAt: '2023-03-01',
      etat_intervention: 'Annulé',
      devis: { reference: 'DEV125' },
      facture: { reference: 'FAC125' }
    }
  ]; // TODO: Obtenir a partir de backend
}
