import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurInterventionComponent } from './utilisateur.intervention.component';

describe('UtilisateurInterventionComponent', () => {
  let component: UtilisateurInterventionComponent;
  let fixture: ComponentFixture<UtilisateurInterventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurInterventionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilisateurInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
