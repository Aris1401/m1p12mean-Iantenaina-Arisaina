import { Component, effect, inject, input, OnInit } from '@angular/core';
import { FicheInterventionService } from '../../../_services/fiche-intervention/fiche-intervention.service';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { TextareaModule } from 'primeng/textarea';
import { CarouselModule } from 'primeng/carousel';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-details-fiche-intervention',
  imports: [DividerModule, ChipModule, TextareaModule, CarouselModule],
  template: `
  <div class="flex flex-col gap-2">
    <div>
      <h5>Type evenement</h5>

      <p-chip [label]="ficheIntervention?.autre_evenement ?? ficheIntervention?.type_evenement?.designation" />
    </div>

    <p-divider />

    <div>
      <h5>Informations</h5>

      <textarea pTextarea rows="10" class="w-full" readonly>{{ ficheIntervention?.description }}</textarea>
    </div>

    <p-divider />

    <div>
      <h5>Plus d'information</h5>

      <p-carousel [value]="ficheIntervention?.documents ?? []" [numVisible]="1"> 
        <ng-template let-document #item>
          <div class="border border-surface rounded p-3 m-2">
            <img [src]="apiUrl + 'storage/' + document.image" />
            {{ document.description }}
          </div>
        </ng-template>
      </p-carousel>
    </div>
  </div>
  `,
  styles: ``
})
export class DetailsFicheInterventionComponent {
  ficheInterventionId : any = input("")

  ficheIntervention : any

  apiUrl : string = environment.apiUrl

  constructor(
    private ficheInterventionService : FicheInterventionService
  ) {
    effect(() => {
      if (this.ficheInterventionId()) {
        this.ficheInterventionService.getFicheIntervetion(this.ficheInterventionId()).subscribe((response : any) => {
          this.ficheIntervention = response.data
        })
      }
    })
  }
}
