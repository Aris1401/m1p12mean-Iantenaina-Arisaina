import { Routes } from '@angular/router';
import { ManagerMecaniciensComponent } from './mecaniciens/manager.mecaniciens.component';
import { ManagerDetailsMecanicienComponent } from './mecaniciens/manager.details-mecanicien.component';
import { ManagerPiecesComponent } from './pieces/manager.pieces.component';

export default [
    { path: 'mecaniciens', component: ManagerMecaniciensComponent },
    { path: 'mecaniciens/:id', component: ManagerDetailsMecanicienComponent },
    { path: 'pieces', component: ManagerPiecesComponent }
] as Routes;
