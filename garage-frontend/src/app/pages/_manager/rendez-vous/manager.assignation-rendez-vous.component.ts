import { Component, OnInit, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { MecanicienService } from '../../../_services/mecaniciens/mecanicien.service';

@Component({
  selector: 'app-manager-assignation-rendez-vous',
  imports: [ButtonModule, DialogModule, TableModule],
  template: `
    <p-table [value]="mecaniciensData" #mcTable [paginator]="true" [rows]="10" [globalFilterFields]="['nom', 'prenom', 'email', 'adresse', 'telephone']">
                <ng-template #caption>
                    <div class="flex justify-between">
                        <div>
                            <input pInputText type="text" name="search" id="search" placeholder="Rechercher" (input)="mcTable.filterGlobal($any($event.target).value, 'contains')" />
                        </div>
                    </div>
                </ng-template>

                <ng-template #header>
                    <tr>
                        <th>Nom / Prenoms</th>
                        <th>Telephone</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </ng-template>

                <ng-template #body let-mecanicien>
                    <tr>
                        <td>{{ mecanicien.nom + ' ' + mecanicien.prenom }}</td>
                        <td>{{ mecanicien.telephone || 'N/A' }}</td>
                        <td>{{ mecanicien.email || 'N/A' }}</td>
                        <td>
                          <p-button label="Assigner" (onClick)="onAssignerMecanicien(mecanicien._id)" />
                        </td>
                    </tr>
                </ng-template>
            </p-table>
  `,
  styles: ``
})
export class ManagerAssignationRendezVousComponent implements OnInit {
  assignerMecanicienClicked = output<any>()

  // Liste des mecaniciens
  mecaniciensData : any[] = []

  constructor(
    private mecanicienService : MecanicienService
  ) {}

  ngOnInit(): void {
      this.mecanicienService.getMecaniciens().subscribe({
        next: (response : any) => {
          this.mecaniciensData = response.data
        }
      })
  }

  onAssignerMecanicien(idMecanicien : any) {
    this.assignerMecanicienClicked.emit(idMecanicien)
  }
}
