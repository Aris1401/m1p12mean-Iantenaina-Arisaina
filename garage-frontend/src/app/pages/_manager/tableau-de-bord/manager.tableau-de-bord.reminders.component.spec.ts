import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTableauDeBordRemindersComponent } from './manager.tableau-de-bord.reminders.component';

describe('ManagerTableauDeBordRemindersComponent', () => {
  let component: ManagerTableauDeBordRemindersComponent;
  let fixture: ComponentFixture<ManagerTableauDeBordRemindersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerTableauDeBordRemindersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerTableauDeBordRemindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
