import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerStatistiquesService {

  constructor(
    private http : HttpClient
  ) { }

  getMois() {
    return this.http.get(environment.apiUrl + "manager/stats/mois")
  }

  getRendezVous() {
    return this.http.get(environment.apiUrl + "manager/stats/rendez-vous")
  }

  getNombreRendezVous() {
    return this.http.get(environment.apiUrl + "manager/stats/rendez-vous/total")
  }

  getAnnees() {
    return this.http.get(environment.apiUrl + "manager/stats/annees")
  }

  getTotalFactureAnnee(annee : any) {
    return this.http.get(environment.apiUrl + "manager/stats/facture/total/annee/" + annee)
  }

  getTotalFactureJour() {
    return this.http.get(environment.apiUrl + "manager/stats/facture/total")
  }

  getNombreDemandeRendezVous() {
    return this.http.get(environment.apiUrl + 'manager/stats/demande-rendez-vous/total')
  }

  getEvolutionFacture(annee : any, mois : any) {
    return this.http.get(environment.apiUrl + "manager/stats/facture/evolution?annee=" + annee + "&mois=" + mois)
  }
}
