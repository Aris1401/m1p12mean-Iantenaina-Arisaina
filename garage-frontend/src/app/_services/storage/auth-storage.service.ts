import { Injectable } from '@angular/core';
import { AuthentificationService } from '../auth/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  constructor(
    private authService : AuthentificationService
  ) { }

  isLoggedIn() {
    return localStorage.getItem('access-token') ? true : false;
  }

  clear() {
    localStorage.removeItem('access-token')
    localStorage.removeItem('roles')
    localStorage.removeItem('displayName')
  }

  saveToken(token : string, roles : string[], nom : string = "") {
    localStorage.setItem('access-token', token);
    localStorage.setItem('roles', JSON.stringify(roles));
    localStorage.setItem('displayName', nom)
  }

  getToken() {
    return localStorage.getItem('access-token');
  }

  getRoles() : string[] {
    return JSON.parse(localStorage.getItem('roles') || "")
  }

  getUser() {
    return new Promise((resolve, reject) => {
      this.authService.getUser().subscribe({
        next: (response) => {
          // Sauvegarde des roles
          const roles = response.user.roles.map((role : any) => {
            return role.role
          })

          localStorage.setItem('roles', JSON.stringify(roles));

          // Retourner l'utilisateur
          resolve(response.user)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
  }
}
