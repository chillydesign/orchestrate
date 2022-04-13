import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Client } from '../models/client.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ClientsService } from '../services/clients.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, OnDestroy {
  public clients: Client[];
  public current_user: User;
  private current_user_subscription: Subscription;
  private clients_sub: Subscription;
  constructor(
    private authService: AuthService,
    private clientsService: ClientsService
  ) { }


  ngOnInit() {
    this.getCurrentUser();

  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;
        if (user) {
          this.getClients();
        }
      }
    );
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

  ngOnDestroy() {
    const subs: Subscription[] = [
      this.clients_sub,
      this.current_user_subscription,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }


}
