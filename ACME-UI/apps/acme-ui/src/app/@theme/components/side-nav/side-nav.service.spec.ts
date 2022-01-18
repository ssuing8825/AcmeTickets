/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';

import { SideNavService } from './side-nav.service';

describe('Service: Sidebar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SideNavService],
    });
  });

  it('should ...', inject([SideNavService], (service: SideNavService) => {
    expect(service).toBeTruthy();
  }));
});
