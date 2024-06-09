import { Component, Input } from '@angular/core';
import { StreamMessage } from 'stream-chat-angular';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() message: StreamMessage | undefined;
}
