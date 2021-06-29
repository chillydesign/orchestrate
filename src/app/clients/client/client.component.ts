import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, OnDestroy {
  public client: Client;
  public client_id: number;
  private client_sub: Subscription;
  private route_params_subscription: Subscription;
  constructor(private clientsService: ClientsService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.subscribeToRoute();
  }




  subscribeToRoute(): void {
    this.route_params_subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params.id) {
          this.client_id = params.id;
          this.getClient();
        }
      }
    ); // end of route_params_subscription

  }

  getClient(): void {
    this.client_sub = this.clientsService.getClient(this.client_id).subscribe(
      (client: Client) => {
        if (client) {
          this.client = client;

        }
      }
    );
  }


  ngOnDestroy() {
    const subs: Subscription[] = [
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
