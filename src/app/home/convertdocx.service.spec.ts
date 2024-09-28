import { TestBed } from '@angular/core/testing';

import { ConvertdocxService } from './convertdocx.service';

describe('ConvertdocxService', () => {
  let service: ConvertdocxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertdocxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
