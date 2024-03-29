


import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { Project } from 'src/app/models/project.model';
import { ClientsService } from 'src/app/services/clients.service';
import { ProjectsOptions, ProjectsService } from 'src/app/services/projects.service';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { TasksOptions, TasksService } from '../services/tasks.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-client-tasks',
  templateUrl: './client-tasks.component.html',
  styleUrls: ['./client-tasks.component.scss']
})
export class ClientTasksComponent implements OnInit, OnDestroy {
  public client: Client;
  public current_user: User;
  public users: User[];
  public tasks: Task[];
  public visible_tasks: Task[];
  public current_col: string;
  public direction = 1;
  public client_id: number;
  public client_slug: string;
  public projects: Project[];
  private client_sub: Subscription;
  private tasks_sub: Subscription;
  private route_params_subscription: Subscription;
  private users_sub: Subscription;
  private current_user_subscription: Subscription;
  constructor(
    private clientsService: ClientsService,
    private authService: AuthService,
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private tasksService: TasksService,
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
          this.getUsers();

        }
      }
    );
  }


  getUsers(): void {
    this.users_sub = this.usersService.getUsers().subscribe(
      (users: User[]) => {
        if (users) {
          this.users = users;
        }
        this.getTasks();
      }
    );
  }



  getClientFromSlug(): void {
    this.client_sub = this.clientsService.getClientFromSlug(this.client_slug).subscribe(
      (client: Client) => {
        if (client) {
          this.client = client;
          this.projectsService.current_project_client.next(client);
          this.getTasks();

        }
      }
    );
  }


  getTasks(): void {

    const opts: TasksOptions = { client_id: this.client.id, };
    this.tasks_sub = this.tasksService.getTasks(opts).subscribe(
      (tasks: Task[]) => {
        if (tasks) {
          this.tasks = tasks;
          this.visible_tasks = tasks;
        }
      }
    );
  }



  sortColumn(column: string): void {

    if (column === this.current_col) {
      this.direction = this.direction * -1; // change from asc to desc
    } else {
      this.current_col = column;
    }

    this.visible_tasks = this.sortByProperty(column);

  }

  sortByProperty(column: string): Task[] {
    const sorted = this.tasks.sort(
      (a, b) => {
        if (a[column] > b[column]) {
          return this.direction;
        } else {
          return (this.direction * -1);
        }
      }
    );
    return sorted;
  }






  ngOnDestroy() {
    const subs: Subscription[] = [
      this.current_user_subscription,
      this.client_sub,
      this.tasks_sub,
      this.route_params_subscription,
      this.users_sub,

    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
