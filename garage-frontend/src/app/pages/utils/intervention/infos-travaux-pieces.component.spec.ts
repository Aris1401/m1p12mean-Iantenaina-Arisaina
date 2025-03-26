import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosTravauxPiecesComponent } from './infos-travaux-pieces.component';

describe('InfosTravauxPiecesComponent', () => {
  let component: InfosTravauxPiecesComponent;
  let fixture: ComponentFixture<InfosTravauxPiecesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfosTravauxPiecesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfosTravauxPiecesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
