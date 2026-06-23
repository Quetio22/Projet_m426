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

  it('gets a paginated list of conversations', () => {
    service.getConversations(2, 10).subscribe((response) => {
      expect(response.page.number).toBe(2);
      expect(response._embedded.conversations[0].id).toBe(4005);
    });

    const request = httpTesting.expectOne(
      (candidate) =>
        candidate.url === '/api/v1/conversations' &&
        candidate.params.get('page') === '2' &&
        candidate.params.get('size') === '10'
    );
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Accept')).toBe('application/hal+json');
    request.flush({
      _embedded: {
        conversations: [
          {
            id: 4005,
            isGroup: false,
            _embedded: { participants: [] }
          }
        ]
      },
      page: {
        size: 10,
        totalElements: 1,
        totalPages: 1,
        number: 2
      },
      _links: {
        self: { href: 'http://localhost:8080/conversations?page=2&size=10' }
      }
    });
  });

  it('gets the paginated messages of a conversation', () => {
    service.getMessages(100, 1, 10).subscribe((response) => {
      expect(response.page.number).toBe(1);
      expect(response._embedded?.messages[0].body).toBe('Bonjour');
    });

    const request = httpTesting.expectOne(
      (candidate) =>
        candidate.url === '/api/v1/conversation/100/messages' &&
        candidate.params.get('page') === '1' &&
        candidate.params.get('size') === '10'
    );
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Accept')).toBe('application/hal+json');
    request.flush({
      _embedded: {
        messages: [
          {
            id: 101,
            senderId: 12,
            body: 'Bonjour',
            sentAt: '2026-06-18T10:30:00',
            participantStatus: []
          }
        ]
      },
      page: {
        size: 10,
        totalElements: 1,
        totalPages: 1,
        number: 1
      },
      _links: {}
    });
  });

  it('sends a message in a conversation', () => {
    service.sendMessage(100, 'Bonjour').subscribe();

    const request = httpTesting.expectOne(
      '/api/v1/conversation/100/messages'
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ message: 'Bonjour' });
    expect(request.request.headers.get('Accept')).toBe('application/hal+json');
    request.flush({
      id: 120,
      senderId: 11,
      body: 'Bonjour',
      sentAt: '2026-06-22T10:30:00',
      participantStatus: []
    });
  });

  it('marks a message as read', () => {
    service.markMessageAsRead(100, 101).subscribe();

    const request = httpTesting.expectOne(
      '/api/v1/conversation/100/messages/101'
    );
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ read: true });
    expect(request.request.headers.get('Accept')).toBe('application/hal+json');
    request.flush({
      id: 101,
      senderId: 12,
      body: 'Bonjour',
      sentAt: '2026-06-22T10:30:00',
      participantStatus: [
        {
          userId: 11,
          readAt: '2026-06-22T10:31:00',
          deleted: false
        }
      ]
    });
  });

  it('updates the role or status of a participant', () => {
    service.updateParticipant(100, 12, { status: 'BLOCKED' }).subscribe();

    const request = httpTesting.expectOne(
      '/api/v1/conversation/100/participants/12'
    );
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ status: 'BLOCKED' });
    expect(request.request.headers.get('Accept')).toBe('application/hal+json');
    request.flush({
      userId: 12,
      username: 'siona@example.com',
      role: 'MEMBER',
      status: 'BLOCKED'
    });
  });
});
