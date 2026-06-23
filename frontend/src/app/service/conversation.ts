import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type ConversationParticipantDto = {
  userId: number;
  username: string;
  role: 'OWNER' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
};

export type UpdateConversationParticipantRequest = {
  role?: ConversationParticipantDto['role'];
  status?: ConversationParticipantDto['status'];
};

export type ConversationResponseDto = {
  id: number;
  isGroup?: boolean;
  group?: boolean;
  _embedded: {
    participants: ConversationParticipantDto[];
  };
};

export type ConversationsPageResponseDto = {
  _embedded: {
    conversations: ConversationResponseDto[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
  _links: Record<string, { href: string }>;
};

export type MessageParticipantStatusDto = {
  userId: number;
  readAt: string | null;
  deleted: boolean;
};

export type MessageResponseDto = {
  id: number;
  senderId: number;
  body: string;
  sentAt: string;
  participantStatus: MessageParticipantStatusDto[];
};

export type MessagesPageResponseDto = {
  _embedded?: {
    messages: MessageResponseDto[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
  _links: Record<string, { href: string }>;
};

export type CreateConversationRequest =
  | { username: string }
  | { participants: Array<{ username: string }> };

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private readonly apiUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  createConversation(request: CreateConversationRequest) {
    return this.http.post<ConversationResponseDto>(
      `${this.apiUrl}/conversations`,
      request
    );
  }

  getConversations(page = 0, size = 20) {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<ConversationsPageResponseDto>(
      `${this.apiUrl}/conversations`,
      {
        params,
        headers: { Accept: 'application/hal+json' }
      }
    );
  }

  getMessages(conversationId: number, page = 0, size = 20) {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<MessagesPageResponseDto>(
      `${this.apiUrl}/conversation/${conversationId}/messages`,
      {
        params,
        headers: { Accept: 'application/hal+json' }
      }
    );
  }

  sendMessage(conversationId: number, message: string) {
    return this.http.post<MessageResponseDto>(
      `${this.apiUrl}/conversation/${conversationId}/messages`,
      { message },
      {
        headers: { Accept: 'application/hal+json' }
      }
    );
  }

  markMessageAsRead(conversationId: number, messageId: number) {
    return this.http.patch<MessageResponseDto>(
      `${this.apiUrl}/conversation/${conversationId}/messages/${messageId}`,
      { read: true },
      {
        headers: { Accept: 'application/hal+json' }
      }
    );
  }

  updateParticipant(
    conversationId: number,
    participantId: number,
    update: UpdateConversationParticipantRequest
  ) {
    return this.http.patch<ConversationParticipantDto>(
      `${this.apiUrl}/conversation/${conversationId}/participants/${participantId}`,
      update,
      {
        headers: { Accept: 'application/hal+json' }
      }
    );
  }
}
