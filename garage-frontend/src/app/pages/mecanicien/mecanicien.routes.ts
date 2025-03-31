import { Routes } from '@angular/router';
import { ListeRdvComponent } from './liste-rdv/liste-rdv.component';
import { ListeInterventionComponent } from './liste-intervention/liste-intervention.component';
import { NewFicheInterventionComponent } from './new-fiche-intervention/new-fiche-intervention.component';

export default [
  { path: 'liste', component: ListeRdvComponent },
  { path: 'intervention', component: ListeInterventionComponent },
  { path: 'new-fiche-intervention/:idIntervention', component: NewFicheInterventionComponent },
] as Routes;
