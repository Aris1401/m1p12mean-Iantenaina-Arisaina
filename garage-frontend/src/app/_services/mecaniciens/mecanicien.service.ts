import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../_env/environment';

@Injectable({
  providedIn: 'root'
})
export class MecanicienService {

  constructor(
    private http : HttpClient
  ) { }

  getMecaniciens() {
    return this.http.get(environment.apiUrl + "mecaniciens")
  }

  getMecanicienById(idMecanicien : string) {
    return this.http.get(environment.apiUrl + "mecaniciens/" + idMecanicien)
  }

  ajouterMecanicien(mecanicienData : any) {
    return this.http.post(environment.apiUrl + "mecaniciens", mecanicienData)
  } 

  getInterventions(idMecanicien : any) {
    return this.http.get(environment.apiUrl + "mecaniciens/" + idMecanicien + "/interventions")
  }
}
