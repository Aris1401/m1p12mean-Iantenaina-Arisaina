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

  addVehicule(data : any) {
    return this.http.post(environment.apiUrl + "vehicules", data)
  } 

  // Docuemnts
  getDocumentVehicule(idVehicule : string) {
    return this.http.get(environment.apiUrl + "vehicules/" + idVehicule + "/documents")
  }

  addDocumentVehicule(idVehicule : string, data : any) {
    return this.http.post(environment.apiUrl + "vehicules/" + idVehicule + "/documents", data)
  } 

  // Informations
  getMarques() {
    return this.http.get(environment.apiUrl + "vehicules/marques")
  }

  getModeles(annee : string, marque: string) {
    return this.http.get(environment.apiUrl + "vehicules/modeles?annee=" + annee + "&marque=" + marque)
  }

  getAnnees() {
    return this.http.get(environment.apiUrl + "vehicules/annees")
  }

  getCarburants() {
    return this.http.get(environment.apiUrl + "vehicules/carburant")
  }

  getBoiteDeVitesse() {
    return this.http.get(environment.apiUrl + "vehicules/boite-vitesse")
  }
}
