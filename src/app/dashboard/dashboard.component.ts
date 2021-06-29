import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public tasks: Task[];
  public current_user: User;
  private current_user_subscription: Subscription;
  private tasks_sub: Subscription;
  constructor(
    private authService: AuthService,
    private tasksService: TasksService,
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }



  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;
        this.getTasks();
      }
    );
  }



  getTasks(): void {


    this.tasks_sub = this.tasksService.getCurrentTasks().subscribe(
      (tasks: Task[]) => {
        if (tasks) {
          this.tasks = tasks;
        }
      }
    );
  }
  removeOldTask(task: Task): void {
    this.tasks = this.tasks.filter(t => t.id !== task.id);

  }




  ngOnDestroy() {
    const subs: Subscription[] = [
      this.current_user_subscription,
      this.tasks_sub,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

}
