import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../_env/environment';
import { Observable } from 'rxjs';

interface LoginCredentials {
  email : string,
  mot_de_passe : string
}

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  constructor(
    private http : HttpClient
  ) {}

  // Login utilisateur
  login (email : string, password : string) : Observable<any> {
    const credentials : LoginCredentials = { email, mot_de_passe: password };

    return this.http.post(environment.apiUrl + 'login', credentials);
  }

  // Insciption utilisateur
  register(utilisateur : any) {
    return this.http.post(environment.apiUrl + 'register', utilisateur)
  }

  // Obtenir les informations de l'utilisateur
  getUser() : Observable<any> {
    return this.http.get(environment.apiUrl + "login/user");
  }

  // TEST
  test () {
    return this.http.get(environment.apiUrl + 'test');
  }
}
