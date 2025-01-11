import { TestBed } from '@angular/core/testing';

import { MediacardService } from './mediacard.service';

describe('MediacardService', () => {
  let service: MediacardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediacardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
