import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

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

  getInterventionsDuJour() {
    return this.http.get(environment.apiUrl + "intervention")
  }

  validerDevisIntervetion(interventionId : any) {
    return this.http.get(environment.apiUrl + "intervention/" + interventionId + "/devis/valider")
  }

  updateDateDebutIntervetion(interventionId : any, dateSelectionner : any) {
    return this.http.put(environment.apiUrl + "intervention/" + interventionId + "/date-debut", {
      selected: dateSelectionner
    })
  }

  getMecaniciensAssigner(intervetionId : any) {
    return this.http.get(environment.apiUrl + "intervention/" + intervetionId + "/mecaniciens")
  } 

  desaffecterMecanicien(interventionId : any, mecanicienId : any) {
    return this.http.delete(environment.apiUrl + "intervention/" + interventionId + "/mecaniciens/" + mecanicienId)
  }

  assignerMecanicien(intervetionId : any, mecanicienId : any) {
    return this.http.post(environment.apiUrl + "intervention/" + intervetionId + "/mecaniciens", {
      mecanicienId: mecanicienId
    })
  }

  refuserDevisIntervetion(interventionId : any) {
    return this.http.get(environment.apiUrl + "intervention/" + interventionId + "/devis/refuser")
  }

  getIntervetionVehicule(vehiculeId : any) {
    return this.http.get(environment.apiUrl + "intervention/vehicule/" + vehiculeId)
  }

  getIntervetionVehiculeCourante(vehiculeId : any) {
    return this.http.get(environment.apiUrl + "intervention/vehicule/" + vehiculeId + "/actif")
  }

  // Facturation
  genererDevis(idIntervention : any) {
    return this.http.post(environment.apiUrl + 'intervention/' + idIntervention + "/devis", {})
  }

  genererFacture(idIntervention : any, observation : string = "") {
    return this.http.post(environment.apiUrl + 'intervention/' + idIntervention + "/facture", {
      observation: observation
    })
  }
  getInterventionData(id: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}intervention/${id}`, {});
  }

  getStockStatus(pieceId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}intervention/stock/${pieceId}`);
  }

  getTravauxFicheIntervention(pieceId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}intervention/stock/${pieceId}`);
  }

  getAllInterventions(): Observable<any> {
    return this.http.get(`${environment.apiUrl}intervention`);
  }

  getEtatIntervention(etat: number): string {
    switch (etat) {
      case -10: return 'En attente';
      case 0: return 'En cours';
      case 10: return 'En attente de pièce';
      case 100: return 'Terminé';
      default: return 'État inconnu';
    }
  }

    createIntervention(idRdv: string): Observable<any> {
      return this.http.post<any>(`${environment.apiUrl}intervention/new`, { idRdv });
    }
    


  getPieceStock(pieceId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}intervention/stock/${pieceId}`);
  }

  setEtatIntervention(interventionId: string): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}intervention/setEtatFini/${interventionId}`, {});
  }
  

}
