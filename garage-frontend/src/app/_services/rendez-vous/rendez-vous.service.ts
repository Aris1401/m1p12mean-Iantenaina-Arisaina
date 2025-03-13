import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../_env/environment';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {

  constructor(
    private http : HttpClient
  ) { }

  // All demandes rendez-vous
  getDemandesRendezVous() {
    return this.http.get(environment.apiUrl + "rendez-vous/demandes")
  }

  // Ajouter demande de rendez-vous
  addDemandeRendezVous(demande : any) {
    return this.http.post(environment.apiUrl + 'rendez-vous/demandes', demande)
  }

  // Types de rendez vous
  getTypesRendezVous() {
    return this.http.get(environment.apiUrl + "rendez-vous/types")
  }
}
