import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { TasksOptions, TasksService } from '../services/tasks.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  public current_user: User;
  public users: User[];
  public search_term: string;
  public search_timeout: any;
  public tasks: Task[];
  private current_user_subscription: Subscription;
  private tasks_sub: Subscription;
  private users_sub: Subscription;
  private route_params_subscription: Subscription;
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private tasksService: TasksService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();

  }


  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;
        if (user) {
          this.getUsers();
        }

        this.subscribeToRoute();
      }
    );
  }
  getUsers(): void {
    this.users_sub = this.usersService.getUsers().subscribe(
      (users: User[]) => {
        if (users) {
          this.users = users;
        }
        // this.processTasks();
      }
    );
  }

  subscribeToRoute(): void {
    this.route_params_subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params.search_term) {
          this.search_term = params.search_term;
          this.onSearch();
        }
      }
    ); // end of route_params_subscription

  }


  onSearch(): void {
    // debounce
    clearTimeout(this.search_timeout);
    this.search_timeout = setTimeout(() => {
      this.getTasks();
    }, 500);



  }


  getTasks(): void {
    if (this.search_term !== '') {
      const opts: TasksOptions = { search_term: this.search_term };
      this.tasks_sub = this.tasksService.getTasks(opts).subscribe(
        (tasks: Task[]) => {
          if (tasks) {
            this.tasks = tasks;
          }
        }
      );
    } else {
      this.tasks = [];
    }
  }

  ngOnDestroy() {

    const subs: Subscription[] = [
      this.current_user_subscription,
      this.tasks_sub,
      this.users_sub,
      this.route_params_subscription,
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }

}
