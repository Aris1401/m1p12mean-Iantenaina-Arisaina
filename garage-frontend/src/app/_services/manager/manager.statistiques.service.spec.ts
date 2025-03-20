import { TestBed } from '@angular/core/testing';

import { ManagerStatistiquesService } from './manager.statistiques.service';

describe('ManagerStatistiquesService', () => {
  let service: ManagerStatistiquesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerStatistiquesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
