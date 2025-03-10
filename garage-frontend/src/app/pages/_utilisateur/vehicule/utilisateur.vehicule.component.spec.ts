import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurVehiculeComponent } from './utilisateur.vehicule.component';

describe('UtilisateurVehiculeComponent', () => {
  let component: UtilisateurVehiculeComponent;
  let fixture: ComponentFixture<UtilisateurVehiculeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurVehiculeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilisateurVehiculeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
