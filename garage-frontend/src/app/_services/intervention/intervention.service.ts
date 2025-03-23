import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../_env/environment';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {

  constructor(
    private http : HttpClient
  ) { }

  getDetailsIntervention(interventionId : any) {
    return this.http.get(environment.apiUrl + "intervention/" + interventionId)
  }

  getIntervetionVehicule(vehiculeId : any) {
    return this.http.get(environment.apiUrl + "intervention/vehicule/" + vehiculeId)
  }

  getIntervetionVehiculeCourante(vehiculeId : any) {
    return this.http.get(environment.apiUrl + "intervention/vehicule/" + vehiculeId + "/actif")
  }
}
