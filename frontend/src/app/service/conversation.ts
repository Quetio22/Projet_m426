import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type ConversationParticipantDto = {
  userId: number;
  username: string;
  role: 'OWNER' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
};

export type ConversationResponseDto = {
  id: number;
  group: boolean;
  _embedded: {
    participants: ConversationParticipantDto[];
  };
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
}
