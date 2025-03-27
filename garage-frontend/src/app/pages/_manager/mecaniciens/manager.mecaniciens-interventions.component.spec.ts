import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerMecaniciensInterventionsComponent } from './manager.mecaniciens-interventions.component';

describe('ManagerMecaniciensInterventionsComponent', () => {
  let component: ManagerMecaniciensInterventionsComponent;
  let fixture: ComponentFixture<ManagerMecaniciensInterventionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerMecaniciensInterventionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerMecaniciensInterventionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
