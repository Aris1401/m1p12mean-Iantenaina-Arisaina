import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../_env/environment';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste-rdv',
  imports: [CommonModule, RouterModule, NgClass, FormsModule], 
  templateUrl: './liste-rdv.component.html',
  styleUrls: ['./liste-rdv.component.scss']
})
export class ListeRdvComponent {
  ArrayRDV: any[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.getAllRDV();
  }

  getAllRDV() {
    this.http.get(`${environment.apiUrl}rendez-vous/rdv`).subscribe(
      (resultData: any) => {
        this.ArrayRDV = resultData.data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des rendez-vous', error);
      }
    );
  }

  goToCreateIntervention(id: string): void {
    this.http.post(`${environment.apiUrl}intervention/new`, { idRdv: id }).subscribe(
      (response) => {
        console.log('Intervention créée avec succès');
        this.router.navigate(['/liste']); 
      },
      (error) => {
        console.error('Erreur lors de la création de l\'intervention', error);
      }
    );
  }
}
