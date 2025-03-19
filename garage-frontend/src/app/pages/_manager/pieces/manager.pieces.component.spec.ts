import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerPiecesComponent } from './manager.pieces.component';

describe('ManagerPiecesComponent', () => {
  let component: ManagerPiecesComponent;
  let fixture: ComponentFixture<ManagerPiecesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerPiecesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerPiecesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
