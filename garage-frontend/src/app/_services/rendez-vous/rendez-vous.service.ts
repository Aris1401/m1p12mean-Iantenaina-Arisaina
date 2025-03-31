import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {

  constructor(
    private http : HttpClient
  ) { }

  // Types de rendez vous
  getTypesRendezVous() {
    return this.http.get(environment.apiUrl + "rendez-vous/types")
  }

  // Obtenir les rendez-vous de l'utilisateur
  getRendezVousUtilisateur() {
    return this.http.get(environment.apiUrl + "rendez-vous/utilisateur")
  }

  // Annuler rendez vous 
  annulerRendezVous(idRendezVous : string) {
    return this.http.delete(environment.apiUrl + "rendez-vous/" + idRendezVous + "/annuler")
  }

  // Obtenir les indisponibilites
  getIndisponibilites() {
    return this.http.get(environment.apiUrl + "rendez-vous/indisponibilite")
  }

  // Obtenir tout les rendez vous (coter manager)
  getRendezVousManager() {
    return this.http.get(environment.apiUrl + "rendez-vous/manager")
  }

  // Obtenir tout les rendez-vous du jour courant
  getRendezVousDuJour() {
    return this.http.get(environment.apiUrl + "rendez-vous/today")
  }

  // Obtenir les mecanicien assigner
  getMecanicienAssigner(idRendezVous : any) {
    return this.http.get(environment.apiUrl + 'rendez-vous/' + idRendezVous + "/assigner")
  }

  // Assigner mecanicien
  assignerMecanicien(idRendezVous : any, idMecanicien : any) {
    return this.http.post(environment.apiUrl + 'rendez-vous/' + idRendezVous + "/assigner", {
      idMecanicien: idMecanicien
    })
  }

  // Demandes rendez-vous

  // Obtenir tout les demandes de rendez-vous (coter manager)
  getDemandesRendezVousManager() {
    return this.http.get(environment.apiUrl + "rendez-vous/demandes/manager")
  }

  validerDemandeRendezVousManager(idDemande : string) {
    return this.http.put(environment.apiUrl + "rendez-vous/demandes/" + idDemande + "/valider", {})
  }

  // All demandes rendez-vous
  getDemandesRendezVous() {
    return this.http.get(environment.apiUrl + "rendez-vous/demandes")
  }

  // Ajouter demande de rendez-vous
  addDemandeRendezVous(demande : any) {
    return this.http.post(environment.apiUrl + 'rendez-vous/demandes', demande)
  }

  // Annuler demande rendez-vous
  annulerDemandeRendezVous(idDemande : string) {
    return this.http.delete(environment.apiUrl + "rendez-vous/demandes/" + idDemande + "/annuler")
  } 

  // Méthode pour récupérer tous les rendez-vous
  getAllRDV(): Observable<any> {
    return this.http.get(`${environment.apiUrl}rendez-vous/liste`);
  }
}
