import { TestBed } from '@angular/core/testing';

import { ChatJSmlService } from './chat-jsml.service';

describe('ChatJSmlService', () => {
  let service: ChatJSmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatJSmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
