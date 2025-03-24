import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurDebutInterventionComponent } from './utilisateur.debut-intervention.component';

describe('UtilisateurDebutInterventionComponent', () => {
  let component: UtilisateurDebutInterventionComponent;
  let fixture: ComponentFixture<UtilisateurDebutInterventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurDebutInterventionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilisateurDebutInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
