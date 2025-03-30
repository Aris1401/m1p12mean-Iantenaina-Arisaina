import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(
    private http : HttpClient
  ) { }

  addUtilisateurDocument(data : any) {
    return this.http.put(environment.apiUrl + "user/document", data)
  }

  deleteDocument(idDocument : any) {
    return this.http.delete(environment.apiUrl + "user/document/" + idDocument)
  }
}
