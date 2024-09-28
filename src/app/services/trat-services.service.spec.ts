import { TestBed } from '@angular/core/testing';

import { TratServicesService } from './trat-services.service';

describe('TratServicesService', () => {
  let service: TratServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TratServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
