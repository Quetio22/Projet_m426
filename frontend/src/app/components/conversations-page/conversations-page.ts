import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  ConversationResponseDto,
  ConversationService,
  CreateConversationRequest
} from '../../service/conversation';
import { AuthService } from '../../service/auth';

type Message = {
  author: string;
  text: string;
  time: string;
  isMine: boolean;
};

type Participant = {
  initials: string;
  name: string;
  status: string;
};

type Conversation = {
  id: number;
  title: string;
  group: boolean;
  createdAt: Date;
  participants: Participant[];
  messages: Message[];
};

@Component({
  selector: 'app-conversations-page',
  imports: [FormsModule],
  templateUrl: './conversations-page.html',
  styleUrl: './conversations-page.scss',
})
export class ConversationsPage {
  newMessage = '';
  newParticipantName = '';
  conversationType: 'private' | 'group' = 'private';
  privateParticipantUsername = '';
  groupParticipantUsername = '';
  conversationParticipants: string[] = [];
  activeConversationId = 1;
  isCreatingConversation = false;
  isAddingParticipant = false;
  readonly creationError = signal('');
  readonly participantError = signal('');
  readonly isSubmittingConversation = signal(false);

  constructor(
    private conversationService: ConversationService,
    private authService: AuthService
  ) {}

  conversations: Conversation[] = [
    {
      id: 1,
      title: 'Test',
      group: false,
      createdAt: new Date(2025, 0, 15),
      participants: [
        {
          initials: 'JD',
          name: 'Jean Dupont',
          status: 'En ligne',
        },
        {
          initials: 'ML',
          name: 'Marie Laurent',
          status: 'Hors ligne',
        },
      ],
      messages: [
        {
          author: 'ML',
          text: 'Salut ! Comment ça va ?',
          time: '10:30',
          isMine: false,
        },
        {
          author: 'Moi',
          text: 'Très bien merci ! Et toi ?',
          time: '10:32',
          isMine: true,
        },
        {
          author: 'ML',
          text: 'Super ! Tu es disponible pour une réunion cet après-midi ?',
          time: '10:35',
          isMine: false,
        },
      ],
    },
  ];

  get activeConversation(): Conversation {
    return (
      this.conversations.find((conversation) => conversation.id === this.activeConversationId) ??
      this.conversations[0]
    );
  }

  get messages(): Message[] {
    return this.activeConversation.messages;
  }

  get participants(): Participant[] {
    return this.activeConversation.participants;
  }

  selectConversation(conversationId: number): void {
    this.activeConversationId = conversationId;
    this.newMessage = '';
    this.isCreatingConversation = false;
    this.isAddingParticipant = false;
  }

  showNewConversationForm(): void {
    this.isCreatingConversation = true;
    this.isAddingParticipant = false;
    this.creationError.set('');
  }

  setConversationType(type: 'private' | 'group'): void {
    this.conversationType = type;
    this.creationError.set('');
  }

  addConversationParticipant(): void {
    const username = this.groupParticipantUsername.trim().toLowerCase();
    const currentUsername = this.authService.getUsername()?.toLowerCase();

    if (!this.isValidUsername(username)) {
      this.creationError.set('Saisis une adresse email ou un numéro au format E.164.');
      return;
    }
    if (username === currentUsername) {
      this.creationError.set('Tu es déjà ajouté automatiquement à la conversation.');
      return;
    }
    if (this.conversationParticipants.includes(username)) {
      this.creationError.set('Ce participant est déjà dans la liste.');
      return;
    }

    this.conversationParticipants = [...this.conversationParticipants, username];
    this.groupParticipantUsername = '';
    this.creationError.set('');
  }

  removeConversationParticipant(username: string): void {
    this.conversationParticipants = this.conversationParticipants.filter(
      (participant) => participant !== username
    );
  }

  createConversation(event: SubmitEvent, form: NgForm): void {
    event.preventDefault();
    this.creationError.set('');

    const privateUsername = this.privateParticipantUsername.trim().toLowerCase();
    if (this.conversationType === 'private' && (!privateUsername || form.invalid)) {
      form.control.markAllAsTouched();
      return;
    }
    if (this.conversationType === 'private' && !this.isValidUsername(privateUsername)) {
      this.creationError.set('Saisis une adresse email ou un numéro au format E.164.');
      return;
    }

    if (this.conversationType === 'group' && this.conversationParticipants.length < 2) {
      this.creationError.set('Ajoute au moins deux participants pour créer un groupe.');
      return;
    }

    const requestedParticipants = this.conversationType === 'private'
      ? [privateUsername]
      : this.conversationParticipants;
    const currentUsername = this.authService.getUsername()?.toLowerCase();

    if (
      currentUsername &&
      requestedParticipants.includes(currentUsername)
    ) {
      this.creationError.set('Tu es déjà ajouté automatiquement à la conversation.');
      return;
    }

    const request: CreateConversationRequest = this.conversationType === 'private'
      ? { username: privateUsername }
      : {
          participants: requestedParticipants.map((username) => ({ username }))
        };

    this.isSubmittingConversation.set(true);
    this.conversationService.createConversation(request).pipe(
      finalize(() => {
        this.isSubmittingConversation.set(false);
      })
    ).subscribe({
      next: (response) => {
        const conversation = this.toConversation(response, requestedParticipants);
        if (conversation.participants.length < 2) {
          this.creationError.set('Tu ne peux pas créer une conversation avec toi-même.');
          return;
        }
        this.conversations = [
          conversation,
          ...this.conversations.filter((item) => item.id !== conversation.id)
        ];
        this.activeConversationId = conversation.id;
        this.resetConversationForm();
      },
      error: (error: HttpErrorResponse) => {
        this.creationError.set(this.getCreationError(error));
      }
    });
  }

  cancelNewConversation(): void {
    this.resetConversationForm();
  }

  sendMessage(): void {
    const text = this.newMessage.trim();

    if (!text) {
      return;
    }

    this.activeConversation.messages.push({
      author: 'Moi',
      text,
      time: this.formatTime(new Date()),
      isMine: true,
    });
    this.newMessage = '';
  }

  showAddParticipantForm(): void {
    if (!this.activeConversation.group) {
      return;
    }

    this.isAddingParticipant = true;
    this.isCreatingConversation = false;
    this.participantError.set('');
  }

  addParticipant(): void {
    const name = this.newParticipantName.trim().toLowerCase();
    const currentUsername = this.authService.getUsername()?.toLowerCase();

    if (!this.isValidUsername(name)) {
      this.participantError.set('Saisis une adresse email ou un numéro au format E.164.');
      return;
    }
    if (
      name === currentUsername ||
      this.activeConversation.participants.some(
        (participant) => participant.name.toLowerCase() === name
      )
    ) {
      this.participantError.set('Ce participant est déjà dans la conversation.');
      return;
    }

    this.activeConversation.participants.push({
      initials: this.createInitials(name),
      name,
      status: 'Invité',
    });
    this.newParticipantName = '';
    this.isAddingParticipant = false;
    this.participantError.set('');
  }

  cancelAddParticipant(): void {
    this.newParticipantName = '';
    this.isAddingParticipant = false;
    this.participantError.set('');
  }

  getConversationPreview(conversation: Conversation): string {
    const lastMessage = conversation.messages.at(-1);

    return lastMessage?.text ?? 'Aucun message';
  }

  getConversationTime(conversation: Conversation): string {
    const lastMessage = conversation.messages.at(-1);

    return lastMessage?.time ?? this.formatTime(conversation.createdAt);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('fr-CH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private createInitials(name: string): string {
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

    return initials || '?';
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('fr-CH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private toConversation(
    response: ConversationResponseDto,
    requestedParticipants: string[]
  ): Conversation {
    const participants = Array.from(
      new Map(
        (response._embedded?.participants ?? []).map((participant) => [
          participant.userId || participant.username,
          participant
        ])
      ).values()
    );

    return {
      id: response.id,
      title: response.group
        ? `Groupe : ${requestedParticipants.join(', ')}`
        : requestedParticipants[0],
      group: response.group,
      createdAt: new Date(),
      participants: participants.map((participant) => ({
        initials: this.createInitials(participant.username),
        name: participant.username,
        status: participant.status
      })),
      messages: []
    };
  }

  private getCreationError(error: HttpErrorResponse): string {
    if (error.status === 400) {
      return 'Vérifie les participants saisis.';
    }
    if (error.status === 401 || error.status === 403) {
      return 'Tu dois être connecté pour créer une conversation.';
    }
    return 'Impossible de créer la conversation pour le moment.';
  }

  private resetConversationForm(): void {
    this.conversationType = 'private';
    this.privateParticipantUsername = '';
    this.groupParticipantUsername = '';
    this.conversationParticipants = [];
    this.creationError.set('');
    this.isCreatingConversation = false;
  }

  private isValidUsername(username: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const e164Pattern = /^\+[1-9]\d{7,14}$/;

    return emailPattern.test(username) || e164Pattern.test(username);
  }
}
