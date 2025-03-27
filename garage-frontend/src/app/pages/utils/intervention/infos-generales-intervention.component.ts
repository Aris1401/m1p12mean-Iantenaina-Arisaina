import { Component, inject, input, output } from '@angular/core';
import { EtatsService } from '../../../_services/etats.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';

@Component({
    selector: 'app-infos-generales-intervention',
    imports: [CommonModule, ButtonModule, CardModule, BadgeModule, ChipModule],
    template: `
        <p-card>
            <ng-template #title>
                <div class="flex gap-2 items-center pb-2">
                    <h5 class="m-0">Fiche intervetion</h5>
                    <p-badge [value]="etatsService.getEtatIntervention(interventionData()?.etat_intervention).etatString" [severity]="etatsService.getEtatIntervention(interventionData()?.etat_intervention).etatColor" />
                </div>
            </ng-template>

            <div class="flex gap-2 justify-between">
                <div class="flex gap-2">
                    <p>Creation: <p-chip label="{{ interventionData()?.createdAt | date: 'yyyy-MM-dd HH:mm' }}" /></p>
                    <p>Debut: <p-chip [label]="(interventionData()?.date_debut | date: 'yyyy-MM-dd HH:mm') ?? 'N/A'" /></p>
                </div>

                <div class="flex gap-2">
                    <p-chip label="Diagnostic" />
                    <p-chip [label]="ficheInterventionData()?.type_evenement?.designation ?? 'N/A'" />
                </div>
            </div>

            <div class="mt-3">
                <p-button label="Details fiche intervention" (onClick)="onClick()" />
            </div>
        </p-card>
    `,
    styles: ``
})
export class InfosGeneralesInterventionComponent {
  ficheInterventionData = input<any>(null)
  interventionData = input<any>(null)

  etatsService = inject(EtatsService)

  onClickFicheIntervention = output<any>()

  onClick() {
    this.onClickFicheIntervention.emit(this.ficheInterventionData()._id)
  }
}
