import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerAssignationRendezVousComponent } from './manager.assignation-rendez-vous.component';

describe('ManagerAssignationRendezVousComponent', () => {
  let component: ManagerAssignationRendezVousComponent;
  let fixture: ComponentFixture<ManagerAssignationRendezVousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerAssignationRendezVousComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerAssignationRendezVousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
