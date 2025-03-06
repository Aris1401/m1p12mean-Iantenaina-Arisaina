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

  public login (email : string, password : string) : Observable<any> {
    const credentials : LoginCredentials = { email, mot_de_passe: password };

    return this.http.post(environment.apiUrl + 'login', credentials);
  }

  test () {
    return this.http.get(environment.apiUrl + 'test');
  }
}
