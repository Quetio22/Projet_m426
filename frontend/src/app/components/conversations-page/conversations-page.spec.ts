import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationsPage } from './conversations-page';

describe('ConversationsPage', () => {
  let component: ConversationsPage;
  let fixture: ComponentFixture<ConversationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create and select a new conversation', () => {
    component.newConversationName = 'Projet M426';
    component.createConversation();

    expect(component.conversations[0].title).toBe('Projet M426');
    expect(component.activeConversation.title).toBe('Projet M426');
    expect(component.newConversationName).toBe('');
  });

  it('should send a message in the active conversation', () => {
    component.newMessage = 'On avance bien.';
    component.sendMessage();

    expect(component.messages.at(-1)?.text).toBe('On avance bien.');
    expect(component.newMessage).toBe('');
  });

  it('should add a participant to the active conversation', () => {
    component.newParticipantName = 'Alice Martin';
    component.addParticipant();

    expect(component.participants.at(-1)).toEqual({
      initials: 'AM',
      name: 'Alice Martin',
      status: 'Invité',
    });
    expect(component.newParticipantName).toBe('');
  });
});
