import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { ClientsService, StatStruct } from 'src/app/services/clients.service';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ProjectsService } from '../services/projects.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';


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
  public hours_worked: number;
  public total_earned: number;
  public average_hours_per_day: number;
  public average_hours_per_month: number;
  public average_earned_per_day: number;
  public average_earned_per_month: number;
  public start_date: string;
  public end_date: string;
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

    this.start_date = moment().subtract('4', 'months').format('YYYY-MM-DD');
    this.end_date = moment().format('YYYY-MM-DD');

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
          this.client_id = client.id;
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
          this.client_id = client.id;
          this.projectsService.current_project_client.next(client);
          this.getStats();


        }
      }
    );
  }


  getStatsOfAllClients(): void {
    this.getStats();
  }



  dateChanged(): void {

    this.getStats()

  }

  getStats(): void {
    const opts = {
      start_date: this.start_date,
      end_date: this.end_date,
      client_id: this.client_id,
    }
    this.stats_sub = this.clientsService.getStats(opts).subscribe({
      next: (data: StatStruct[]) => {

        this.processStats(data);

      }
    });
  }


  processStats(data: StatStruct[]): void {
    if (data.length > 0) {
      const sets = data.map(datum => { return { label: datum.name, type: 'bar', backgroundColor: datum.color, client_slug: datum.client_slug, client_name: datum.name, data: datum.data.map(d => d.data) } });

      const chart_data = {
        labels: data[0].data.map((d) => d.month),
        // datasets: [{ data: data[0].map(d => d.data) }]
        datasets: sets,
      };

      if (!this.chart_config) {
        const config = this.chart_configuration();
        config.data = chart_data;
        this.chart_config = config;
      }


      const hours: number[] = data.map(d => d.data.map(c => c.data)).flat();
      const months: string[] = data.map(d => d.data.map(c => c.month)).flat().sort();
      const first_month = moment(months[0]).startOf('month');
      const last_month = moment(months[months.length - 1]).endOf('month');
      const days_worked = Math.max(1, last_month.diff(first_month, 'days'));
      const months_worked = Math.max(1, last_month.diff(first_month, 'months'));

      this.hours_worked = this.niceRound(hours.reduce((a, b) => a + b, 0));
      this.average_hours_per_day = this.niceRound(this.hours_worked / days_worked);
      this.average_hours_per_month = this.niceRound(this.hours_worked / months_worked);
      this.total_earned = this.hours_worked * environment.hourly_wage;
      this.average_earned_per_day = this.total_earned / days_worked;
      this.average_earned_per_month = this.total_earned / months_worked;
      this.chart_data_sub.next(chart_data);
    } else {
      this.hours_worked = 0;
      this.chart_data_sub.next({ labels: [], datasets: [] })
    }
  }

  niceRound(number): number {
    return Math.round(number * 10) / 10;
  }

  chart_configuration(): ChartConfiguration {
    return {
      type: 'bar',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        animation: {
          duration: 500,
        },
        legend: {
          display: (this.client_id === undefined),
          position: 'bottom'
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
