import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurRendezVousComponent } from './utilisateur.rendez-vous.component';

describe('UtilisateurRendezVousComponent', () => {
  let component: UtilisateurRendezVousComponent;
  let fixture: ComponentFixture<UtilisateurRendezVousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurRendezVousComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilisateurRendezVousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
