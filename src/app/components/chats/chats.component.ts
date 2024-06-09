import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ChannelPreviewContext, ChannelService, ChatClientService, CustomTemplatesService, MessageContext, StreamI18nService } from 'stream-chat-angular';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent implements OnInit, AfterViewInit {

  @ViewChild('customMessageTemplate') messageTemplate!: TemplateRef<MessageContext>;
  @ViewChild('customChannelPreviewTemplate') channelPreviewTemplate!: TemplateRef<ChannelPreviewContext>;

  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
    private customTemplatesService: CustomTemplatesService
  ) {
    const apiKey = 'dz5f4d5kzrue';
    const userId = 'dawn-bush-4';
    const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGF3bi1idXNoLTQiLCJleHAiOjE3MTY2NTY3NTl9.zVS2wjzPDwef9oUcRq_gAByw2l1Rq4A7YcQQN4Cd4ok';
    this.chatService.init(apiKey, userId, userToken);
    this.streamI18nService.setTranslation();
  }

  async ngOnInit() {
    const channel = this.chatService.chatClient.channel('messaging', 'talking-about-angular', {
      // add as many custom fields as you'd like
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/2048px-Angular_full_color_logo.svg.png',
      name: 'Talking about Angular',
    });
    await channel.create();
    this.channelService.init({
      type: 'messaging',
      id: { $eq: 'talking-about-angular' },
    });
  }

  ngAfterViewInit(): void {
    // Register your template
    this.customTemplatesService.messageTemplate$.next(this.messageTemplate);
    this.customTemplatesService.channelPreviewTemplate$.next(this.channelPreviewTemplate);
  }

}
