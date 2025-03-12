import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurRendezVousListeDemandeComponent } from './utilisateur.rendez-vous.liste-demande.component';

describe('UtilisateurRendezVousListeDemandeComponent', () => {
  let component: UtilisateurRendezVousListeDemandeComponent;
  let fixture: ComponentFixture<UtilisateurRendezVousListeDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurRendezVousListeDemandeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilisateurRendezVousListeDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
