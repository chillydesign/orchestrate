import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { ClientsService } from 'src/app/services/clients.service';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-client-stats',
  templateUrl: './client-stats.component.html',
  styleUrls: ['./client-stats.component.scss']
})
export class ClientStatsComponent implements OnInit, OnDestroy {
  public client: Client;
  public current_user: User;
  public client_id: number;
  public client_slug: string;
  public chart_config: ChartConfiguration;
  public chart_data: ChartData;
  private client_sub: Subscription;
  private stats_sub: Subscription;
  private route_params_subscription: Subscription;
  private current_user_subscription: Subscription;
  constructor(
    private projectsService: ProjectsService,
    private clientsService: ClientsService,
    private authService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.getCurrentUser();

  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;

        this.subscribeToRoute();
      }
    );
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
          this.projectsService.current_project_client.next(client);
          this.getStats();

        }
      }
    );
  }






  getClientFromSlug(): void {
    this.client_sub = this.clientsService.getClientFromSlug(this.client_slug).subscribe(
      (client: Client) => {
        if (client) {
          this.client = client;
          this.projectsService.current_project_client.next(client);
          this.getStats();


        }
      }
    );
  }




  getStats(): void {

    this.stats_sub = this.clientsService.getStats(this.client.id).subscribe({
      next: (data) => {
        this.chart_config = this.chart_configuration();
        this.chart_data = {
          labels: data.map((d) => d.month),
          datasets: [{ data: data.map(d => d.data) }]
        };
      }
    });


  }

  chart_configuration(): ChartConfiguration {
    return {

      data: {
        labels: [],
        datasets: [
          {
            type: 'bar',
            label: 'mins',
            data: [],
            borderWidth: 1,
            backgroundColor: '#4a85e0',
          }
        ]
      },
      options: {
        animation: {
          duration: 500,
        },
        legend: {
          display: false
        },
        title: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
            }
          }],

          xAxes: [{
            offset: true,
            type: 'time',
            time: {
              unit: 'month',
              displayFormats: {
                day: 'MM',
              },
              tooltipFormat: 'll'
            },
            ticks: {
              fontSize: 8,
              autoSkip: false,
              maxRotation: 90,

            }
          }]
        }
      }
    };
  }

  ngOnDestroy() {
    const subs: Subscription[] = [
      this.current_user_subscription,
      this.client_sub,
      this.stats_sub,
      this.route_params_subscription,

    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
