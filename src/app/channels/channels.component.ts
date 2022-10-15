import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChannelsOptions, ChannelsService } from '../services/channels.service';
import { Channel } from '../models/channel.model';
import { Params, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Client } from '../models/client.model';
import { ClientsService } from '../services/clients.service';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit, OnDestroy {
  public current_user: User;
  public channels: Channel[];
  public: boolean;
  public channel: Channel;
  public client_slug: string;
  public client: Client;
  private channels_sub: Subscription;
  private route_params_subscription: Subscription;
  private current_user_subscription: Subscription;
  private client_sub: Subscription;
  constructor(
    private channelsService: ChannelsService,
    private authService: AuthService,
    private projectsService: ProjectsService,
    private clientsService: ClientsService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.subscribeToRoute();


  }

  // getCurrentUser(): void {
  //   this.current_user_subscription = this.authService.current_user.subscribe(
  //     (user: User) => {
  //       this.current_user = user;
  //     }
  //   );
  // }



  subscribeToRoute(): void {
    this.route_params_subscription = this.route.params.subscribe(
      (params: Params) => {


        if (params.slug) {
          this.client_slug = params.slug;
          this.getClientFromSlug();
        } else {
          this.getChannels();

        }


      }


    ); // end of route_params_subscription
  }


  getClientFromSlug(): void {
    this.client_sub = this.clientsService.getClientFromSlug(this.client_slug).subscribe(
      (client: Client) => {
        if (client) {
          this.client = client;
          this.projectsService.current_project_client.next(client);
          this.getChannels();

        }
      }
    );
  }


  getChannels(): void {

    let opts = {}
    if (this.client) {
      opts = { client_id: this.client.id };
    }
    this.channels_sub = this.channelsService.getChannels(opts).subscribe(
      (channels: Channel[]) => {
        this.channels = channels;
      }
    );
  }


  selectChannel(channel: Channel): void {
    this.channel = null;
    setTimeout(() => {
      this.channel = channel;
    }, 50);
  }




  ngOnDestroy() {

    const subs: Subscription[] = [
      this.channels_sub,
      this.current_user_subscription,
      this.client_sub,
      this.route_params_subscription,
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }




}
