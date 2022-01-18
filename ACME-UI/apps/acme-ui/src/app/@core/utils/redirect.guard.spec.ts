import { TestBed } from '@angular/core/testing';

import { RedirectGuard } from './redirect.guard';

describe('RedirectGuardService', () => {
  let service: RedirectGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedirectGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
