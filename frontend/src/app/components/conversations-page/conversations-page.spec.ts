import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { ConversationsPage } from './conversations-page';
import { ConversationService } from '../../service/conversation';
import { AuthService } from '../../service/auth';

describe('ConversationsPage', () => {
  let component: ConversationsPage;
  let fixture: ComponentFixture<ConversationsPage>;
  const createConversation = vi.fn();
  const getConversations = vi.fn();
  const getMessages = vi.fn();

  beforeEach(async () => {
    createConversation.mockReset();
    getConversations.mockReset();
    getMessages.mockReset();
    getConversations.mockReturnValue(of({
      _embedded: {
        conversations: [
          {
            id: 4004,
            isGroup: false,
            _embedded: {
              participants: [
                {
                  userId: 11,
                  username: 'sheana@example.com',
                  role: 'MEMBER',
                  status: 'ACTIVE'
                },
                {
                  userId: 12,
                  username: 'siona@example.com',
                  role: 'MEMBER',
                  status: 'ACTIVE'
                }
              ]
            }
          }
        ]
      },
      page: { size: 20, totalElements: 1, totalPages: 1, number: 0 },
      _links: {}
    }));
    createConversation.mockReturnValue(of({
      id: 4005,
      group: false,
      _embedded: {
        participants: [
          {
            userId: 11,
            username: 'sheana@example.com',
            role: 'MEMBER',
            status: 'ACTIVE'
          },
          {
            userId: 14,
            username: 'trevize@example.com',
            role: 'MEMBER',
            status: 'ACTIVE'
          }
        ]
      }
    }));
    getMessages.mockReturnValue(of({
      _embedded: {
        messages: [
          {
            id: 100,
            senderId: 11,
            body: 'Mon message',
            sentAt: '2026-06-18T10:30:00',
            participantStatus: []
          },
          {
            id: 101,
            senderId: 12,
            body: 'Sa réponse',
            sentAt: '2026-06-18T10:31:00',
            participantStatus: []
          }
        ]
      },
      page: { size: 20, totalElements: 2, totalPages: 1, number: 0 },
      _links: {}
    }));

    await TestBed.configureTestingModule({
      imports: [ConversationsPage],
      providers: [
        {
          provide: ConversationService,
          useValue: { createConversation, getConversations, getMessages }
        },
        {
          provide: AuthService,
          useValue: { getUsername: () => 'sheana@example.com' }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load conversations on initialization', () => {
    expect(getConversations).toHaveBeenCalledWith(0, 20);
    expect(component.conversations[0].id).toBe(4004);
    expect(component.conversations[0].title).toBe('siona@example.com');
    expect(component.activeConversationId).toBe(4004);
  });

  it('should load and map messages for the active conversation', () => {
    expect(getMessages).toHaveBeenCalledWith(4004, 0, 20);
    expect(component.messages).toEqual([
      {
        id: 100,
        author: 'Moi',
        avatar: 'M',
        text: 'Mon message',
        time: '10:30',
        isMine: true
      },
      {
        id: 101,
        author: 'siona@example.com',
        avatar: 'S',
        text: 'Sa réponse',
        time: '10:31',
        isMine: false
      }
    ]);
  });

  it('should display an empty state when the API returns no messages', () => {
    getMessages.mockReturnValue(of({
      page: { size: 20, totalElements: 0, totalPages: 0, number: 0 },
      _links: {}
    }));

    component.loadMessages(4004);

    expect(component.messages).toEqual([]);
    expect(component.messagesError()).toBe('');
  });

  it('should expose a message when loading messages fails', () => {
    getMessages.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 })));

    component.loadMessages(4004);

    expect(component.messages).toEqual([]);
    expect(component.messagesError()).toContain('n’existe plus');
  });

  it('should create and select a private conversation returned by the API', () => {
    component.privateParticipantUsername = 'trevize@example.com';
    const form = {
      invalid: false,
      control: { markAllAsTouched: vi.fn() }
    } as unknown as NgForm;

    component.createConversation(
      new SubmitEvent('submit', { cancelable: true }),
      form
    );

    expect(createConversation).toHaveBeenCalledWith({
      username: 'trevize@example.com'
    });
    expect(component.conversations[0].id).toBe(4005);
    expect(component.activeConversationId).toBe(4005);
    expect(component.activeConversation?.title).toBe('trevize@example.com');
    expect(component.isCreatingConversation).toBe(false);
  });

  it('should require at least two participants for a group', () => {
    component.conversationType = 'group';
    component.conversationParticipants = ['siona@example.com'];
    const form = {
      invalid: false,
      control: { markAllAsTouched: vi.fn() }
    } as unknown as NgForm;

    component.createConversation(
      new SubmitEvent('submit', { cancelable: true }),
      form
    );

    expect(createConversation).not.toHaveBeenCalled();
    expect(component.creationError()).toContain('au moins deux participants');
  });

  it('should reject an invalid group participant', () => {
    component.groupParticipantUsername = 'awdwa';

    component.addConversationParticipant();

    expect(component.conversationParticipants).toEqual([]);
    expect(component.creationError()).toContain('adresse email');
  });

  it('should reject a duplicate group participant', () => {
    component.conversationParticipants = ['siona@example.com'];
    component.groupParticipantUsername = 'siona@example.com';

    component.addConversationParticipant();

    expect(component.conversationParticipants).toEqual(['siona@example.com']);
    expect(component.creationError()).toContain('déjà dans la liste');
  });

  it('should prevent adding the connected user as a participant', () => {
    component.privateParticipantUsername = 'sheana@example.com';
    const form = {
      invalid: false,
      control: { markAllAsTouched: vi.fn() }
    } as unknown as NgForm;

    component.createConversation(
      new SubmitEvent('submit', { cancelable: true }),
      form
    );

    expect(createConversation).not.toHaveBeenCalled();
    expect(component.creationError()).toContain('déjà ajouté automatiquement');
  });

  it('should send a message in the active conversation', () => {
    component.newMessage = 'On avance bien.';
    component.sendMessage();

    expect(component.messages.at(-1)?.text).toBe('On avance bien.');
    expect(component.newMessage).toBe('');
  });

  it('should add a participant to the active conversation', () => {
    component.activeConversation!.group = true;
    component.newParticipantName = 'alice@example.com';
    component.addParticipant();

    expect(component.participants.at(-1)).toEqual({
      initials: 'A',
      name: 'alice@example.com',
      status: 'Invité',
    });
    expect(component.newParticipantName).toBe('');
  });

  it('should reject a participant already in the active conversation', () => {
    component.activeConversation!.group = true;
    component.activeConversation!.participants.push({
      initials: 'A',
      name: 'alice@example.com',
      status: 'ACTIVE'
    });
    component.newParticipantName = 'alice@example.com';

    component.addParticipant();

    expect(component.participantError()).toContain('déjà dans la conversation');
  });
});
