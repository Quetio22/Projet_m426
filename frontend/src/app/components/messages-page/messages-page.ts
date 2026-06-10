import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Message = {
  author: string;
  text: string;
  time: string;
  isMine: boolean;
};

@Component({
  selector: 'app-messages-page',
  imports: [FormsModule],
  templateUrl: './messages-page.html',
  styleUrl: './messages-page.scss',
})
export class MessagesPage {
  newMessage = '';

  messages: Message[] = [
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
  ];

  sendMessage(): void {
    const text = this.newMessage.trim();

    if (!text) {
      return;
    }

    this.messages.push({
      author: 'Moi',
      text,
      time: new Date().toLocaleTimeString('fr-CH', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isMine: true,
    });
    this.newMessage = '';
  }
}
