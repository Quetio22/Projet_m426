import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ConversationService } from './conversation';

describe('ConversationService', () => {
  let service: ConversationService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ConversationService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('creates a private conversation', () => {
    service.createConversation({ username: 'trevize@example.com' }).subscribe();

    const request = httpTesting.expectOne('/api/v1/conversations');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'trevize@example.com' });
    request.flush({
      id: 100,
      group: false,
      _embedded: { participants: [] }
    });
  });

  it('creates a group conversation', () => {
    const body = {
      participants: [
        { username: 'siona@example.com' },
        { username: 'fallom@example.com' }
      ]
    };

    service.createConversation(body).subscribe();

    const request = httpTesting.expectOne('/api/v1/conversations');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(body);
    request.flush({
      id: 104,
      group: true,
      _embedded: { participants: [] }
    });
  });
});
