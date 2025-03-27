import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosGeneralesInterventionComponent } from './infos-generales-intervention.component';

describe('InfosGeneralesIntervetionComponent', () => {
  let component: InfosGeneralesInterventionComponent;
  let fixture: ComponentFixture<InfosGeneralesInterventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfosGeneralesInterventionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfosGeneralesInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
