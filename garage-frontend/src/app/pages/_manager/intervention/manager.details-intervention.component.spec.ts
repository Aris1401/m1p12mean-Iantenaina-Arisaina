import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDetailsInterventionComponent } from './manager.details-intervention.component';

describe('ManagerDetailsInterventionComponent', () => {
  let component: ManagerDetailsInterventionComponent;
  let fixture: ComponentFixture<ManagerDetailsInterventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerDetailsInterventionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerDetailsInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
