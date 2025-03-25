import { TestBed } from '@angular/core/testing';

import { FicheInterventionService } from './fiche-intervention.service';

describe('FicheInterventionService', () => {
  let service: FicheInterventionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FicheInterventionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
