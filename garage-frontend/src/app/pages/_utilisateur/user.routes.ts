import { Routes } from '@angular/router';
import { UtilisateurProfilComponent } from './profil/utilisateur.profil.component';
import { UtilisateurVehiculeComponent } from './vehicule/utilisateur.vehicule.component';
import { UtilisateurDetailsVehiculeComponent } from './vehicule/utilisateur.details-vehicule.component';

export default [
    { path: 'profil', component: UtilisateurProfilComponent },
    { path: 'vehicule', component: UtilisateurVehiculeComponent },
    { path: 'vehicule/:id', component: UtilisateurDetailsVehiculeComponent }
] as Routes;
