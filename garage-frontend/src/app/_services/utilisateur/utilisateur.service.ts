import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../_env/environment';

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
}
