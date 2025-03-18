import { Routes } from '@angular/router';
import { ManagerMecaniciensComponent } from './mecaniciens/manager.mecaniciens.component';
import { ManagerDetailsMecanicienComponent } from './mecaniciens/manager.details-mecanicien.component';
import { ManagerPiecesComponent } from './pieces/manager.pieces.component';
import { ManagerDemandeRendezVousComponent } from './rendez-vous/manager.demande-rendez-vous.component';
import { ManagerTableauDeBordComponent } from './tableau-de-bord/manager.tableau-de-bord.component';

export default [
    { path: 'tableau-de-bord', component: ManagerTableauDeBordComponent },
    { path: 'mecaniciens', component: ManagerMecaniciensComponent },
    { path: 'mecaniciens/:id', component: ManagerDetailsMecanicienComponent },
    { path: 'pieces', component: ManagerPiecesComponent },
    { path: 'rendez-vous', component: ManagerDemandeRendezVousComponent }
] as Routes;
