import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { TasksService } from 'src/app/services/tasks.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit, OnDestroy {
  @Input() project: Project;
  @Output() taskCreated: EventEmitter<Task | null | undefined> = new EventEmitter(undefined);
  public task: Task;
  public current_user: User;
  private add_task_sub: Subscription;
  private current_user_subscription: Subscription;

  constructor(private tasksService: TasksService, private authService: AuthService) { }


  ngOnInit(): void {
    this.getCurrentUser();
  }


  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;

        this.resetNewTask();
      }
    );
  }



  resetNewTask(): void {
    this.task = new Task();
    this.task.project_id = this.project.id;
    this.task.is_public = true; // (!this.current_user);
  }


  onSubmit(): void {
    // set the order of this task as one more than the previous highest task
    // so we dont have to do lots of calculations if we order later on
    this.task.ordering = this.project.getNextTaskOrdering();

    this.add_task_sub = this.tasksService.addTask(this.task).subscribe(
      (task: Task) => {
        // emit completed task to parent
        if (task) {
          this.taskCreated.next(task);
          // set this task to a new one to add a new one
          this.resetNewTask();
        }

      },
      (error) => console.log(error)
    );

  }

  ngOnDestroy() {

    const subs: Subscription[] = [
      this.add_task_sub,
      this.current_user_subscription,
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }


}
