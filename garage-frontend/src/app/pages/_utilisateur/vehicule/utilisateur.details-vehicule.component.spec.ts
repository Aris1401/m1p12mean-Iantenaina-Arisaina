import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurDetailsVehiculeComponent } from './utilisateur.details-vehicule.component';

describe('UtilisateurDetailsVehiculeComponent', () => {
  let component: UtilisateurDetailsVehiculeComponent;
  let fixture: ComponentFixture<UtilisateurDetailsVehiculeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurDetailsVehiculeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilisateurDetailsVehiculeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
