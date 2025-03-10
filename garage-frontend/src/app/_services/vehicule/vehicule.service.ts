import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../_env/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {

  constructor(
    private http : HttpClient
  ) { }

  getVehicules() {
    return this.http.get(environment.apiUrl + "vehicules");
  }

  getVehicule(id : string) {
    return this.http.get(environment.apiUrl + "vehicules/" + id);
  }

  // Docuemnts
  getDocumentVehicule(idVehicule : string) {
    return this.http.get(environment.apiUrl + "vehicules/" + idVehicule + "/documents")
  }

  addDocumentVehicule(idVehicule : string, data : any) {
    return this.http.post(environment.apiUrl + "vehicules/" + idVehicule + "/documents", data)
  } 
}
