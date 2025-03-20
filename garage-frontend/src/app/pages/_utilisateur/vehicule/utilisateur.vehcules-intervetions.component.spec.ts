import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurVehculesIntervetionsComponent } from './utilisateur.vehicules-intervetions.component';

describe('UtilisateurVehculesIntervetionsComponent', () => {
  let component: UtilisateurVehculesIntervetionsComponent;
  let fixture: ComponentFixture<UtilisateurVehculesIntervetionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurVehculesIntervetionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilisateurVehculesIntervetionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
