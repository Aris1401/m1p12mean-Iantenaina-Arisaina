import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDemandeRendezVousComponent } from './manager.demande-rendez-vous.component';

describe('ManagerDemandeRendezVousComponent', () => {
  let component: ManagerDemandeRendezVousComponent;
  let fixture: ComponentFixture<ManagerDemandeRendezVousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerDemandeRendezVousComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerDemandeRendezVousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
