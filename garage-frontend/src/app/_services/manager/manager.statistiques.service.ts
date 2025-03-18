import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../_env/environment';

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

  getAnnees() {
    return this.http.get(environment.apiUrl + "manager/stats/annees")
  }
}
