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
  public total_hours: string;
  public total_earned: string;
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

    const opts: ProjectsOptions = { assignee: this.current_user, current: true };
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

        const total_minutes: number = this.tasks_completed_today.map(t => t.time_taken).reduce((a, b) => b + a, 0);
        const hours = Math.floor(total_minutes / 60);
        const minutes = total_minutes - (hours * 60);
        this.total_hours = `${hours} hr ${minutes} mins`;

        const formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
        const pounds = total_minutes * this.hourly_rate / 60;
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


    let labels = [];
    let points = [];
    let rolling_average = [];
    let target = [];

    return {

      data: {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: '£',
            data: points,
            borderWidth: 1,
            backgroundColor: '#2a75d0aa',
          },
          {
            type: 'line',
            label: 'Av.',
            data: rolling_average,
            borderWidth: 1,
            pointRadius: 0,
          },
          {
            type: 'line',
            label: 'Target',
            data: target,
            borderWidth: 1,
            pointRadius: 0,
            borderColor: '#aaaaaa',
            fill: false,


          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        title: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 0
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
