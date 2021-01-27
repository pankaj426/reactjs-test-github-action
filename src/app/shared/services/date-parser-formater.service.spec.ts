import { TestBed } from '@angular/core/testing';

import { DateParserFormaterService } from './date-parser-formater.service';

describe('DateParserFormaterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DateParserFormaterService = TestBed.get(DateParserFormaterService);
    expect(service).toBeTruthy();
  });
});
