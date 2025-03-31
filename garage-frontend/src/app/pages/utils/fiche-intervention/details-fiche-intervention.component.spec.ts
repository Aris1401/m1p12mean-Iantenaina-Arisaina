import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFicheInterventionComponent } from './details-fiche-intervention.component';

describe('DetailsFicheInterventionComponent', () => {
  let component: DetailsFicheInterventionComponent;
  let fixture: ComponentFixture<DetailsFicheInterventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsFicheInterventionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsFicheInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
