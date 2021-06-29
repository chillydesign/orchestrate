import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { Project } from 'src/app/models/project.model';
import { ClientsService } from 'src/app/services/clients.service';
import { ProjectsOptions, ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, OnDestroy {
  public client: Client;
  public client_id: number;
  public client_slug: string;
  public projects: Project[];
  private client_sub: Subscription;
  private projects_sub: Subscription;
  private route_params_subscription: Subscription;
  constructor(
    private clientsService: ClientsService,
    private projectsService: ProjectsService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.subscribeToRoute();
  }




  subscribeToRoute(): void {
    this.route_params_subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params.id) {
          this.client_id = params.id;
          this.getClient();
        } else if (params.slug) {
          this.client_slug = params.slug;
          this.getClientFromSlug();
        }



      }
    ); // end of route_params_subscription

  }

  getClient(): void {
    this.client_sub = this.clientsService.getClient(this.client_id).subscribe(
      (client: Client) => {
        if (client) {
          this.client = client;
          this.getProjects();

        }
      }
    );
  }
  getClientFromSlug(): void {
    this.client_sub = this.clientsService.getClientFromSlug(this.client_slug).subscribe(
      (client: Client) => {
        if (client) {
          this.client = client;
          this.getProjects();

        }
      }
    );
  }

  getProjects(): void {
    const options: ProjectsOptions = { client_id: this.client.id };
    this.projects_sub = this.projectsService.getProjects(options).subscribe(
      (projects: Project[]) => {
        if (projects) {
          this.projects = projects;
          this.projects.map(p => p.client = this.client);
        }
      }
    );
  }


  ngOnDestroy() {
    const subs: Subscription[] = [
      this.client_sub,
      this.projects_sub,
      this.route_params_subscription,

    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
