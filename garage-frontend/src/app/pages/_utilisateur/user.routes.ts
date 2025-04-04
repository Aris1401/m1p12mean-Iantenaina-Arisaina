import { Routes } from '@angular/router';
import { UtilisateurProfilComponent } from './profil/utilisateur.profil.component';
import { UtilisateurVehiculeComponent } from './vehicule/utilisateur.vehicule.component';
import { UtilisateurDetailsVehiculeComponent } from './vehicule/utilisateur.details-vehicule.component';
import { UtilisateurRendezVousComponent } from './rendez-vous/utilisateur.rendez-vous.component';
import { UtilisateurInterventionComponent } from './intervention/utilisateur.intervention.component';

export default [
    { path: 'profil', component: UtilisateurProfilComponent },
    { path: 'vehicule', component: UtilisateurVehiculeComponent },
    { path: 'vehicule/:id', component: UtilisateurDetailsVehiculeComponent },
    { path: 'rendez-vous', component: UtilisateurRendezVousComponent },
    { path: 'intervention/:id', component: UtilisateurInterventionComponent }
] as Routes;
