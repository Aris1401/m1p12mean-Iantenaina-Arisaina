import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerFacturesComponent } from './manager.factures.component';

describe('ManagerFacturesComponent', () => {
  let component: ManagerFacturesComponent;
  let fixture: ComponentFixture<ManagerFacturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerFacturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerFacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
