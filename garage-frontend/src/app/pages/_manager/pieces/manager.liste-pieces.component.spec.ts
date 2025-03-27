import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerListePiecesComponent } from './manager.liste-pieces.component';

describe('ManagerListePiecesComponent', () => {
  let component: ManagerListePiecesComponent;
  let fixture: ComponentFixture<ManagerListePiecesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerListePiecesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerListePiecesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
