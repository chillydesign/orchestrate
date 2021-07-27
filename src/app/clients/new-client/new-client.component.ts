import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { ClientsService } from 'src/app/services/clients.service';
import { Client } from 'src/app/models/client.model';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit, OnDestroy {
  public client_id: number;
  public canSubmitForm = false;
  public formLoading = false;
  public formSuccess = false;
  public client = new Client();
  public clients: Client[];
  public errors: Subject<object> = new Subject();
  private clients_sub: Subscription;
  private route_params_subscription: Subscription;
  private add_client_sub: Subscription;

  constructor(
    private clientsService: ClientsService,
    private router: Router,
  ) { }

  ngOnInit() {


  }





  onFormChange(): void {
    // let server figure out if object is valid
    this.canSubmitForm = true;

  }

  onSubmit(): void {

    this.onFormChange();

    if (this.canSubmitForm) {

      this.formLoading = true;

      this.add_client_sub = this.clientsService.addClient(this.client).subscribe(
        (client: Client) => {
          this.formLoading = false;
          this.formSuccess = true;
          this.errors.next(null);
          this.router.navigate(['/clients', client.slug]);
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
      this.add_client_sub,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
