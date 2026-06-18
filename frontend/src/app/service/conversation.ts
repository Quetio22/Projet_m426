import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type ConversationParticipantDto = {
  userId: number;
  username: string;
  role: 'OWNER' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
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
}
