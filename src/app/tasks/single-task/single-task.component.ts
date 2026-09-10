import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-single-task',
  templateUrl: './single-task.component.html',
  styleUrl: './single-task.component.scss'
})
export class SingleTaskComponent implements OnInit, OnDestroy {
  public task: Task;
  public task_id: number;
  public current_user: User;
  private current_user_subscription: Subscription;
  private get_sub: Subscription;
  private route_params_subscription: Subscription;
  constructor(
    private tasksService: TasksService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }



  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe({
      next: (user: User) => {
        this.current_user = user;
        if (user) {
          this.subscribeToRoute();

        }
      }
    });
  }



  subscribeToRoute(): void {
    this.route_params_subscription = this.route.params.subscribe({
      next: (params: Params) => {
        if (params.id) {
          this.task_id = params.id;
          this.getTask();
        }
      }
    });

  }



  getTask(): void {
    this.get_sub = this.tasksService.getTask(this.task_id).subscribe({
      next: (task) => {
        this.task = task;
      },
      error: (error) => {

      }
    })
  }

  removeOldTask(task: Task): void {

  }
  taskUpdated(newtask: Task): void {
  }


  ngOnDestroy() {
    const subs: Subscription[] = [
      this.current_user_subscription,
      this.route_params_subscription,
      this.get_sub,

    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }


}
