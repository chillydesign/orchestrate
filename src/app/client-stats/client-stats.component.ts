import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { ClientsService, StatStruct } from 'src/app/services/clients.service';
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
  public chart_data_sub: Subject<ChartData> = new Subject();
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

        if (user) {
          this.subscribeToRoute();
        }
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
        } else {
          this.getStatsOfAllClients();
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
          this.getStats(client.id);

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
          this.getStats(client.id);


        }
      }
    );
  }


  getStatsOfAllClients(): void {
    this.getStats();
  }



  getStats(client_id?: number): void {

    this.stats_sub = this.clientsService.getStats(client_id).subscribe({
      next: (data: StatStruct[]) => {
        const sets = data.map(datum => { return { type: 'bar', backgroundColor: datum.color, client_slug: datum.client_slug, client_name: datum.name, data: datum.data.map(d => d.data) } });

        const chart_data = {
          labels: data[0].data.map((d) => d.month),
          // datasets: [{ data: data[0].map(d => d.data) }]
          datasets: sets,
        };
        const config = this.chart_configuration();
        config.data = chart_data;
        this.chart_config = config;
      }
    });
  }

  chart_configuration(): ChartConfiguration {
    return {
      type: 'bar',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        tooltips: {
          callbacks: {
            label: function (context, data: any) {
              const ind = context.datasetIndex;
              let label = data.datasets[ind].label;
              if (!label) {
                label = `${data.datasets[ind].client_name}: ${context.yLabel}`
                return label;
              }
            }
          }
        },

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
            stacked: true,
            ticks: {
              min: 0,
            }
          }],

          xAxes: [{
            stacked: true,
            offset: true,
            type: 'time',
            time: {
              unit: 'month',
              displayFormats: {
                day: 'MM',
              },

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
