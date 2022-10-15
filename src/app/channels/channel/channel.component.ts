import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Channel } from 'src/app/models/channel.model';
import { Message } from 'src/app/models/message.model';
import { Project } from 'src/app/models/project.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChannelsService } from 'src/app/services/channels.service';
import { MessagesService } from 'src/app/services/messages.service';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnDestroy {
  @Input() channel_id: number;
  public channel: Channel;
  public project: Project;
  public current_user: User;
  public messages_loading: boolean;
  public no_project: boolean;
  public newmessage: Message;
  private messages_sub: Subscription;
  private current_user_subscription: Subscription;
  private add_sub: Subscription;
  private channel_sub: Subscription;
  private project_sub: Subscription;
  private route_params_subscription: Subscription;

  constructor(
    private authService: AuthService,
    private channelsService: ChannelsService,
    private projectsService: ProjectsService,
    private messagesService: MessagesService,
  ) { }

  ngOnInit(): void {

    if (this.channel_id) {
      this.getCurrentUser();

    }


  }



  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;
        this.getChannel();


      }
    );
  }




  getChannel(): void {
    this.channel_sub = this.channelsService.getChannel(this.channel_id).subscribe(
      (channel) => {
        this.channel = channel;
        if (channel) {
          this.resetNewMessage();

          if (this.channel.project_id) {
            this.getProject();
          } else {
            this.no_project = true;
          }
        }
      }
    );
  }

  makeProject(): void {

  }


  getProject(): void {
    this.project_sub = this.projectsService.getProject(this.channel.project_id).subscribe(
      (project: Project) => {
        if (project) {
          this.project = project;
        }
      }
    );
  }
  // getMessages(): void {
  //   this.messages_loading = true;
  //   this.messages_sub = this.messagesService.getMessages(this.channel.id).subscribe(
  //     (messages) => {
  //       this.messages = messages;
  //       this.scrollToBottom();
  //     },
  //     (error) => console.log(error),
  //     () => this.messages_loading = false
  //   )

  // }


  scrollToBottom(): void {
    setTimeout(() => {
      const els = document.querySelectorAll('.message_container');
      if (els.length > 0) {
        const el = els[els.length - 1]
        if (el) {
          el.parentElement.scrollTop = 10000000000;
        }
      }
    }, 20);

  }


  onSubmit(): void {

    this.add_sub = this.messagesService.addMessage(this.newmessage).subscribe(
      (message: Message) => {

        if (message) {

          if (!this.channel.messages) {
            this.channel.messages = []
          }
          this.channel.messages.push(message);
          this.resetNewMessage();
          this.scrollToBottom();
        }

      },
      (error) => console.log(error)
    );

  }

  resetNewMessage(): void {
    this.newmessage = new Message({ channel_id: this.channel?.id, user_id: this.current_user?.id });
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
      this.route_params_subscription,
      this.channel_sub,
      this.project_sub,
      this.current_user_subscription,
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }





}
