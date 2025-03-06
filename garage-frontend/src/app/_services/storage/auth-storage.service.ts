import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  constructor() { }

  getToken() {
    return localStorage.getItem('access-token');
  }

  saveToken(token : string) {
    localStorage.setItem('access-token', token);
  }
}
