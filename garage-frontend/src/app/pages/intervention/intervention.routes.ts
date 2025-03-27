import { Routes } from "@angular/router";
import { ListeRdvComponent } from "./liste-rdv/liste-rdv.component";


export default [
    { path: 'liste', component: ListeRdvComponent },
    { path: 'fiche-intervention', component: ListeRdvComponent },
] as Routes;
