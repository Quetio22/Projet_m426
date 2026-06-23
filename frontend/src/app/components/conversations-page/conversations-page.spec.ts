import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { EMPTY, of, Subject, throwError } from 'rxjs';
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
  const sendMessage = vi.fn();
  const markMessageAsRead = vi.fn();
  const updateParticipant = vi.fn();

  beforeEach(async () => {
    createConversation.mockReset();
    getConversations.mockReset();
    getMessages.mockReset();
    sendMessage.mockReset();
    markMessageAsRead.mockReset();
    updateParticipant.mockReset();
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
            participantStatus: [
              { userId: 11, readAt: '2026-06-18T10:30:00', deleted: false },
              { userId: 12, readAt: null, deleted: false }
            ]
          },
          {
            id: 101,
            senderId: 12,
            body: 'Sa réponse',
            sentAt: '2026-06-18T10:31:00',
            participantStatus: [
              { userId: 11, readAt: null, deleted: false },
              { userId: 12, readAt: '2026-06-18T10:31:00', deleted: false }
            ]
          }
        ]
      },
      page: { size: 20, totalElements: 2, totalPages: 1, number: 0 },
      _links: {}
    }));
    sendMessage.mockReturnValue(of({
      id: 120,
      senderId: 11,
      body: 'On avance bien.',
      sentAt: '2026-06-22T10:30:00',
      participantStatus: []
    }));
    markMessageAsRead.mockReturnValue(EMPTY);
    updateParticipant.mockImplementation((_conversationId, participantId, update) => of({
      userId: participantId,
      username: 'siona@example.com',
      role: update.role ?? 'MEMBER',
      status: update.status ?? 'ACTIVE'
    }));

    await TestBed.configureTestingModule({
      imports: [ConversationsPage],
      providers: [
        {
          provide: ConversationService,
          useValue: {
            createConversation,
            getConversations,
            getMessages,
            sendMessage,
            markMessageAsRead,
            updateParticipant
          }
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
        senderId: 11,
        author: 'Moi',
        avatar: 'M',
        text: 'Mon message',
        time: '10:30',
        isMine: true,
        participantStatus: [
          { userId: 11, readAt: '2026-06-18T10:30:00', deleted: false },
          { userId: 12, readAt: null, deleted: false }
        ],
        readStatus: 'Envoyé'
      },
      {
        id: 101,
        senderId: 12,
        author: 'siona@example.com',
        avatar: 'S',
        text: 'Sa réponse',
        time: '10:31',
        isMine: false,
        participantStatus: [
          { userId: 11, readAt: null, deleted: false },
          { userId: 12, readAt: '2026-06-18T10:31:00', deleted: false }
        ],
        readStatus: ''
      }
    ]);
  });

  it('should display messages from oldest to newest', () => {
    getMessages.mockReturnValue(of({
      _embedded: {
        messages: [
          {
            id: 202,
            senderId: 12,
            body: 'Message récent',
            sentAt: '2026-06-22T06:18:00',
            participantStatus: []
          },
          {
            id: 101,
            senderId: 12,
            body: 'Message ancien',
            sentAt: '2026-06-18T06:47:00',
            participantStatus: []
          }
        ]
      },
      page: { size: 20, totalElements: 2, totalPages: 1, number: 0 },
      _links: {}
    }));

    component.loadMessages(4004);

    expect(component.messages.map((message) => message.text)).toEqual([
      'Message ancien',
      'Message récent'
    ]);
  });

  it('should display how many recipients have read my message', () => {
    getMessages.mockReturnValue(of({
      _embedded: {
        messages: [
          {
            id: 102,
            senderId: 11,
            body: 'Message de groupe',
            sentAt: '2026-06-18T10:32:00',
            participantStatus: [
              { userId: 11, readAt: '2026-06-18T10:32:00', deleted: false },
              { userId: 12, readAt: '2026-06-18T10:33:00', deleted: false },
              { userId: 13, readAt: '2026-06-18T10:34:00', deleted: false }
            ]
          }
        ]
      },
      page: { size: 20, totalElements: 1, totalPages: 1, number: 0 },
      _links: {}
    }));

    component.loadMessages(4004);

    expect(component.messages[0].readStatus).toBe('Lu par 2');
  });

  it('should mark received unread messages as read', () => {
    expect(markMessageAsRead).toHaveBeenCalledWith(4004, 101);
    expect(markMessageAsRead).not.toHaveBeenCalledWith(4004, 100);
  });

  it('should preload messages for conversation previews', () => {
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
          },
          {
            id: 4006,
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
                  userId: 16,
                  username: 'daneel@example.com',
                  role: 'MEMBER',
                  status: 'ACTIVE'
                }
              ]
            }
          }
        ]
      },
      page: { size: 20, totalElements: 2, totalPages: 1, number: 0 },
      _links: {}
    }));

    component.loadConversations();

    expect(getMessages).toHaveBeenCalledWith(4004, 0, 20);
    expect(getMessages).toHaveBeenCalledWith(4006, 0, 20);
    expect(component.conversations[1].messages.at(-1)?.text).toBe('Sa réponse');
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
    getMessages.mockClear();

    component.sendMessage(
      new SubmitEvent('submit', { cancelable: true })
    );

    expect(sendMessage).toHaveBeenCalledWith(4004, 'On avance bien.');
    expect(getMessages).toHaveBeenCalledWith(4004, 0, 20);
    expect(component.newMessage).toBe('');
  });

  it('should reject an empty message', () => {
    component.newMessage = '   ';

    component.sendMessage(
      new SubmitEvent('submit', { cancelable: true })
    );

    expect(sendMessage).not.toHaveBeenCalled();
    expect(component.sendMessageError()).toContain('ne peut pas être vide');
  });

  it('should keep the message when sending fails', () => {
    sendMessage.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 403 }))
    );
    component.newMessage = 'Message refusé';

    component.sendMessage(
      new SubmitEvent('submit', { cancelable: true })
    );

    expect(component.newMessage).toBe('Message refusé');
    expect(component.sendMessageError()).toContain('droit');
  });

  it('should not send another message while one is already being sent', () => {
    const pendingRequest = new Subject();
    sendMessage.mockReturnValue(pendingRequest);
    component.newMessage = 'Premier message';

    component.sendMessage(
      new SubmitEvent('submit', { cancelable: true })
    );
    component.sendMessage(
      new SubmitEvent('submit', { cancelable: true })
    );

    expect(sendMessage).toHaveBeenCalledTimes(1);
  });

  it('should add a participant to the active conversation', () => {
    component.activeConversation!.group = true;
    component.newParticipantName = 'alice@example.com';
    component.addParticipant();

    expect(component.participants.at(-1)).toEqual({
      initials: 'A',
      name: 'alice@example.com',
      role: 'MEMBER',
      status: 'Invité',
    });
    expect(component.newParticipantName).toBe('');
  });

  it('should reject a participant already in the active conversation', () => {
    component.activeConversation!.group = true;
    component.activeConversation!.participants.push({
      initials: 'A',
      name: 'alice@example.com',
      role: 'MEMBER',
      status: 'ACTIVE'
    });
    component.newParticipantName = 'alice@example.com';

    component.addParticipant();

    expect(component.participantError()).toContain('déjà dans la conversation');
  });

  it('should patch and update a participant status', () => {
    component.activeConversation!.group = true;
    component.activeConversation!.participants[0].role = 'OWNER';
    const participant = component.activeConversation!.participants[1];

    component.toggleParticipantStatus(participant);

    expect(updateParticipant).toHaveBeenCalledWith(4004, 12, {
      status: 'BLOCKED'
    });
    expect(participant.status).toBe('BLOCKED');
  });

  it('should patch and update a participant role', () => {
    component.activeConversation!.group = true;
    component.activeConversation!.participants[0].role = 'OWNER';
    const participant = component.activeConversation!.participants[1];

    component.toggleParticipantRole(participant);

    expect(updateParticipant).toHaveBeenCalledWith(4004, 12, {
      role: 'OWNER'
    });
    expect(participant.role).toBe('OWNER');
  });
});
