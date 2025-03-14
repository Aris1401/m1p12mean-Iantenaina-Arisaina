import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDetailsMecanicienComponent } from './manager.details-mecanicien.component';

describe('ManagerDetailsMecanicienComponent', () => {
  let component: ManagerDetailsMecanicienComponent;
  let fixture: ComponentFixture<ManagerDetailsMecanicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerDetailsMecanicienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerDetailsMecanicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
