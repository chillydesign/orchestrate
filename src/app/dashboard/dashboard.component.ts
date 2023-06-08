import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ProjectsService } from '../services/projects.service';
import { TasksService } from '../services/tasks.service';
import { ProjectsOptions } from '../services/projects.service';
import { ChartConfiguration } from 'chart.js';
import * as Chart from 'chart.js';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public tasks_completed_today: Task[];
  public tasks: Task[];
  public monthly_stats: { date: string, hours: number }[];
  public projects: Project[];
  public current_user: User;
  public start_date = moment();
  public total_minutes: number;
  public total_earned: string;
  public search_term: string;
  public chart: Chart;
  public hourly_rate: number = 55;
  public daily_target = 123;
  @ViewChild('chartContainer', { static: true }) public chartContainer: ElementRef;

  private current_user_subscription: Subscription;
  private tasks_sub: Subscription;
  private stats_sub: Subscription;
  private comple_today_sub: Subscription;
  private projects_sub: Subscription;
  constructor(
    private authService: AuthService,
    private projectsService: ProjectsService,
    private tasksService: TasksService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }



  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        if (user) {
          this.current_user = user;
          this.initialiseChart();

          this.getTasks();
        }

      }
    );
  }



  getTasks(): void {

    const opts: ProjectsOptions = { limit: 5 };
    this.projects_sub = this.projectsService.getProjects(opts).subscribe(
      (projects: Project[]) => {
        if (projects) {
          this.projects = projects;
        }

        if (this.current_user) {
          this.getTasksCompletedToday();
          this.getStats();
        }

      }
    );
  }



  getTasksCompletedToday(): void {
    this.comple_today_sub = this.tasksService.getTasksCompletedToday().subscribe(
      (tasks: Task[]) => {
        this.tasks_completed_today = tasks;

        this.total_minutes = this.tasks_completed_today.map(t => t.time_taken).reduce((a, b) => b + a, 0);


        const formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
        const pounds = this.total_minutes * this.hourly_rate / 60;
        this.total_earned = formatter.format(pounds).concat(` @ £55/hr`);
      }
    );
  }



  getStats(): void {
    const start_date_string = this.start_date.format('YYYY-MM-DD');
    this.stats_sub = this.tasksService.getMonthlyStats(start_date_string).subscribe(
      (stats: any) => {
        if (stats) {
          this.monthly_stats = (stats);

          this.loadChartData();

        }

      }
    )
  }


  initialiseChart(): void {
    if (this.chartContainer) {

      // setTimeout(() => { }, 450);
      const canvas = this.chartContainer.nativeElement;
      const config = this.chart_config();
      this.chart = new Chart(canvas, config);
    }
  }



  chart_config(): ChartConfiguration {




    return {

      data: {
        labels: [],
        datasets: [
          {
            type: 'bar',
            label: '£',
            data: [],
            borderWidth: 1,
            backgroundColor: '#4a85e0',
          },
          {
            type: 'line',
            steppedLine: true,
            label: 'Av.',
            data: [],
            borderWidth: 1,
            pointRadius: 0,
            backgroundColor: 'rgba(220,220,220,0.25)',

          },
          {
            type: 'line',
            label: 'Target',
            data: [],
            borderWidth: 1,
            pointRadius: 0,
            borderColor: '#666686',
            fill: false,


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
              suggestedMax: 300,
            }
          }],

          xAxes: [{
            offset: true,
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'DD',
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

  loadChartData(): void {

    const points: number[] = this.monthly_stats.map(s => Math.round(s.hours * 55 / 60));
    const labels = this.monthly_stats.map(s => s.date);

    const days = 7;
    const target = [];
    const rolling_average = [];
    for (let p = 0; p < points.length; p++) {
      const start = Math.max(0, p - Math.floor((days / 2)));
      const end = Math.min(points.length, p + Math.ceil(days / 2));
      const subset = points.slice(start, end);
      const sum = subset.reduce((a, b) => a + b, 0);
      const av = Math.round(sum / (subset.length));

      rolling_average.push(av);
      target.push(this.daily_target);
    }


    setTimeout(() => {
      this.chart.data.datasets[0].data = points;
      this.chart.data.datasets[1].data = rolling_average;
      this.chart.data.datasets[2].data = target;
      this.chart.data.labels = labels;
      this.chart.update();
    }, 360);

  }


  goBackwards(): void {
    this.start_date.subtract(1, 'week');
    this.getStats();

  }
  goForwards(): void {
    this.start_date.add(1, 'week');
    this.getStats();

  }


  removeOldTask(task: Task): void {
    const project = this.projects.find(pr => pr.id === task.project_id);
    project.tasks = project.tasks.filter(t => t.id !== task.id);
  }



  onSearch(): void {
    if (this.search_term != undefined && this.search_term != '') {
      this.router.navigate(['/search', this.search_term]);

    }

  }


  ngOnDestroy() {
    const subs: Subscription[] = [
      this.current_user_subscription,
      this.projects_sub,
      this.tasks_sub,
      this.comple_today_sub,
      this.stats_sub,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

}
