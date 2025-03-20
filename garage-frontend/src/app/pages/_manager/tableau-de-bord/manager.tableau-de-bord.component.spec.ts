import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTableauDeBordComponent } from './manager.tableau-de-bord.component';

describe('ManagerTableauDeBordComponent', () => {
  let component: ManagerTableauDeBordComponent;
  let fixture: ComponentFixture<ManagerTableauDeBordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerTableauDeBordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerTableauDeBordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
