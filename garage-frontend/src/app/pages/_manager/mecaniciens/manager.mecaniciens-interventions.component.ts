import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-manager-mecaniciens-interventions',
  imports: [CardModule, TableModule],
  template: `
    <p-card header="Liste des interventions">
      <p-table>
        <ng-template pTemplate="header">
          <tr>
            <th>Intervention</th>
            <th>Client</th>
            <th>Date</th>
            <th></th>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
  styles: ``
})
export class ManagerMecaniciensInterventionsComponent {

}
