import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Client } from '../models/client.model';
import { ClientsService } from '../services/clients.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, OnDestroy {
  public clients: Client[];
  private clients_sub: Subscription;
  constructor(
    private clientsService: ClientsService
  ) { }

  ngOnInit(): void {
    this.getClients();
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
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }


}
