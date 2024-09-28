import { TestBed } from '@angular/core/testing';

import { AuthFaceService } from './auth-face.service';

describe('AuthFaceService', () => {
  let service: AuthFaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthFaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
