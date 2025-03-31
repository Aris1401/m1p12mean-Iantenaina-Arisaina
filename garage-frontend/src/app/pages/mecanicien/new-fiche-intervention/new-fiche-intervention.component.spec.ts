import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFicheInterventionComponent } from './new-fiche-intervention.component';

describe('NewFicheInterventionComponent', () => {
  let component: NewFicheInterventionComponent;
  let fixture: ComponentFixture<NewFicheInterventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFicheInterventionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewFicheInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
