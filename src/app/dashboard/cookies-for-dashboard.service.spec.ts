import { TestBed } from '@angular/core/testing';

import { CookiesForDashboardService } from './cookies-for-dashboard.service';

describe('CookiesForDashboardService', () => {
  let service: CookiesForDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookiesForDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
