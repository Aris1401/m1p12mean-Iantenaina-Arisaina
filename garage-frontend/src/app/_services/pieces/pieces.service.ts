import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PiecesService {

  constructor(
    private http: HttpClient
  ) { }

  getPieces() {
    return this.http.get(environment.apiUrl + "pieces")
  }

  getEtatStock() {
    return this.http.get(environment.apiUrl + "pieces/stock")
  }

  ajouterStock(data : any) {
    return this.http.post(environment.apiUrl + "pieces", data)
  }

  modifierPiece(data : any) {
    return this.http.put(environment.apiUrl + "pieces", data)
  }
  
  getMouvementStock(idPiece : any) {
    return this.http.get(environment.apiUrl + "pieces/mouvement/" + idPiece)
  }

  getInterventionEnRupture() {
    return this.http.get(environment.apiUrl + "pieces/interventions")
  }
}
