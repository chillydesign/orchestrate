import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Channel } from 'src/app/models/channel.model';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnDestroy {
  @Input() channel: Channel;
  public current_user: User;
  public messages_loading: boolean;
  public messages: Message[] = [];
  public newmessage: Message;
  private messages_sub: Subscription;
  private current_user_subscription: Subscription;
  private add_sub: Subscription;
  constructor(
    private authService: AuthService,
    private messagesService: MessagesService,
  ) { }

  ngOnInit(): void {

    if (this.channel) {

      this.getCurrentUser();


    }
  }

  getMessages(): void {
    this.messages_loading = true;
    this.messages_sub = this.messagesService.getMessages(this.channel.id).subscribe(
      (messages) => {
        this.messages = messages;
      },
      (error) => console.log(error),
      () => this.messages_loading = false
    )

  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;
        this.getMessages();
        this.resetNewMessage();

      }
    );
  }



  onSubmit(): void {

    this.add_sub = this.messagesService.addMessage(this.newmessage).subscribe(
      (message: Message) => {

        if (message) {
          this.messages.push(message);
          this.resetNewMessage();
        }

      },
      (error) => console.log(error)
    );

  }

  resetNewMessage(): void {

    this.newmessage = new Message({ channel_id: this.channel.id, user_id: this.current_user?.id });
  }


  saveCommentOnEnter(event): boolean {
    if (event.key === 'Enter') {

      this.onSubmit();
      return false;
    }
  }




  ngOnDestroy() {

    const subs: Subscription[] = [
      this.messages_sub,
      this.add_sub,
      this.current_user_subscription,
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }





}
