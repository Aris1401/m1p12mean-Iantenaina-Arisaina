import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

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

  // Mettre à jour une fiche d'intervention
  updateFicheIntervention(id: string, ficheData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}fiche-interventions/update-save/${id}`, ficheData);
  }


}
