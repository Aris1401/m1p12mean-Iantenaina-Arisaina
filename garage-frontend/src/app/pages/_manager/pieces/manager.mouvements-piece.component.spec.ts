import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerMouvementsPieceComponent } from './manager.mouvements-piece.component';

describe('ManagerMouvementsPieceComponent', () => {
  let component: ManagerMouvementsPieceComponent;
  let fixture: ComponentFixture<ManagerMouvementsPieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerMouvementsPieceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerMouvementsPieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
