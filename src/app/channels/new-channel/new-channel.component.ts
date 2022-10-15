import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { ChannelsService } from 'src/app/services/channels.service';
import { Channel } from 'src/app/models/channel.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { Client } from 'src/app/models/client.model';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-new-channel',
  templateUrl: './new-channel.component.html',
  styleUrls: ['./new-channel.component.scss']
})
export class NewChannelComponent implements OnInit, OnDestroy {
  public client_id: number;
  public canSubmitForm = false;
  public formLoading = false;
  public formSuccess = false;
  public channel = new Channel();
  public clients: Client[];
  public errors: Subject<object> = new Subject();
  private clients_sub: Subscription;
  private route_params_subscription: Subscription;
  private add_channel_sub: Subscription;

  constructor(
    private channelsService: ChannelsService,
    private clientsService: ClientsService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.subscribeToRoute();

  }

  subscribeToRoute(): void {
    this.route_params_subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params.client_id) {
          this.client_id = parseInt(params.client_id, 10);
          this.channel.client_id = this.client_id;
        } else {
          this.getClients();
        }
      }
    ); // end of route_params_subscription

  }



  getClients(): void {
    this.clients_sub = this.clientsService.getClients().subscribe(
      (clients: Client[]) => {
        if (clients) {
          this.clients = clients;
        }
      }
    );
  }


  onFormChange(): void {
    // let server figure out if object is valid
    this.canSubmitForm = true;

  }

  onSubmit(): void {

    this.onFormChange();

    if (this.canSubmitForm) {

      this.formLoading = true;

      this.add_channel_sub = this.channelsService.addChannel(this.channel).subscribe(
        (channel: Channel) => {
          this.formLoading = false;
          this.formSuccess = true;
          this.errors.next(null);

          this.router.navigate(['/channels']);

        },
        (error) => {
          this.errors.next(error.error);
          this.formLoading = false;
          this.formSuccess = false;
        }
      );
    }
  }


  ngOnDestroy() {
    const subs: Subscription[] = [
      this.route_params_subscription,
      this.clients_sub,
      this.add_channel_sub,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
