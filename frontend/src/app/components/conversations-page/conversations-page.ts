import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  newConversationName = '';
  newParticipantName = '';
  activeConversationId = 1;
  isCreatingConversation = false;
  isAddingParticipant = false;

  conversations: Conversation[] = [
    {
      id: 1,
      title: 'Test',
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
  }

  createConversation(): void {
    const title = this.newConversationName.trim();

    if (!title) {
      return;
    }

    const now = new Date();
    const conversation: Conversation = {
      id: now.getTime(),
      title,
      createdAt: now,
      participants: [
        {
          initials: 'Moi',
          name: 'Moi',
          status: 'En ligne',
        },
      ],
      messages: [],
    };

    this.conversations = [conversation, ...this.conversations];
    this.activeConversationId = conversation.id;
    this.newConversationName = '';
    this.isCreatingConversation = false;
  }

  cancelNewConversation(): void {
    this.newConversationName = '';
    this.isCreatingConversation = false;
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
    this.isAddingParticipant = true;
    this.isCreatingConversation = false;
  }

  addParticipant(): void {
    const name = this.newParticipantName.trim();

    if (!name) {
      return;
    }

    this.activeConversation.participants.push({
      initials: this.createInitials(name),
      name,
      status: 'Invité',
    });
    this.newParticipantName = '';
    this.isAddingParticipant = false;
  }

  cancelAddParticipant(): void {
    this.newParticipantName = '';
    this.isAddingParticipant = false;
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
}
