import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ProjectsService } from '../services/projects.service';
import { TasksService } from '../services/tasks.service';
import { ProjectsOptions } from '../services/projects.service';
import { ChartConfiguration, ChartData } from 'chart.js';
import * as Chart from 'chart.js';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
  public total_earned: number;
  public search_term: string;
  public hourly_wage = environment.hourly_wage;
  public chart: Chart;
  public chart_data_sub: Subject<ChartData> = new Subject();
  public daily_target = 123;
  public average_earned: number;
  public chart_config: ChartConfiguration;
  public chart_data: ChartData;
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
        this.total_earned = this.minutesToPounds(this.total_minutes);

      }
    );
  }


  minutesToPounds(mins: number): number {
    return mins * environment.hourly_wage / 60;
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
    this.chart_config = this.chart_configuration();

  }



  chart_configuration(): ChartConfiguration {

    return {
      type: 'bar',
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
            backgroundColor: 'rgba(170,170,190,0.21)',

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

    const points: number[] = this.monthly_stats.map(s => Math.round(s.hours * environment.hourly_wage / 60));
    const labels = this.monthly_stats.map(s => s.date);

    const days = 7;
    const target = [];
    const rolling_average = [];

    if (points.length > 0) {
      this.average_earned = this.minutesToPounds(points.reduce((a, b) => a + b, 0) / points.length);
    } else {
      this.average_earned = null;
    }

    let avear = 0;
    for (let p = 0; p < points.length; p++) {
      const start = Math.max(0, p - Math.floor((days / 2)));
      const end = Math.min(points.length, p + Math.ceil(days / 2));
      const subset = points.slice(start, end);
      const sum = subset.reduce((a, b) => a + b, 0);
      const av = Math.round(sum / (subset.length));

      rolling_average.push(av);
      target.push(this.daily_target);
    }


    this.chart_data = {
      labels: labels,
      datasets: [
        { data: points }, { data: rolling_average }, { data: target }
      ]
    };
    this.chart_data_sub.next(this.chart_data);



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
