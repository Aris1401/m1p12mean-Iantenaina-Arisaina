import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../_env/environment';

@Injectable({
  providedIn: 'root'
})
export class FicheInterventionService {

  constructor(
    private http : HttpClient
  ) { }

  // Fiche intervention
  getFicheIntervetion(ficheId : any) {
    return this.http.get(environment.apiUrl + "fiche-interventions/" + ficheId)
  } 

  getTravauxFicheIntervention(ficheId : any) {
    return this.http.get(environment.apiUrl + "fiche-interventions/" + ficheId + "/travaux")
  }

  getPiecesFicheIntervention(ficheId: any) {
    return this.http.get(environment.apiUrl + "fiche-interventions/" + ficheId + "/pieces")
  }
}
