import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ConversationsPage } from './conversations-page';
import { ConversationService } from '../../service/conversation';
import { AuthService } from '../../service/auth';

describe('ConversationsPage', () => {
  let component: ConversationsPage;
  let fixture: ComponentFixture<ConversationsPage>;
  const createConversation = vi.fn();

  beforeEach(async () => {
    createConversation.mockReset();
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

    await TestBed.configureTestingModule({
      imports: [ConversationsPage],
      providers: [
        {
          provide: ConversationService,
          useValue: { createConversation }
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
    expect(component.activeConversation.title).toBe('trevize@example.com');
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
    component.activeConversation.group = true;
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
    component.activeConversation.group = true;
    component.activeConversation.participants.push({
      initials: 'A',
      name: 'alice@example.com',
      status: 'ACTIVE'
    });
    component.newParticipantName = 'alice@example.com';

    component.addParticipant();

    expect(component.participantError()).toContain('déjà dans la conversation');
  });
});
