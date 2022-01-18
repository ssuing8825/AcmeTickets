/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';

import { CoreService } from './core.service';

describe('Service: Core', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreService],
    });
  });

  it('should ...', inject([CoreService], (service: CoreService) => {
    expect(service).toBeTruthy();
  }));
});
