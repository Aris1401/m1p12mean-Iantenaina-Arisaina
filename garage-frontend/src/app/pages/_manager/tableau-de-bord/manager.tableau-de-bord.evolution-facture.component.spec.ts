import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTableauDeBordEvolutionFactureComponent } from './manager.tableau-de-bord.evolution-facture.component';

describe('ManagerTableauDeBordEvolutionFactureComponent', () => {
  let component: ManagerTableauDeBordEvolutionFactureComponent;
  let fixture: ComponentFixture<ManagerTableauDeBordEvolutionFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerTableauDeBordEvolutionFactureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerTableauDeBordEvolutionFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
