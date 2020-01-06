import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { TasksService } from 'src/app/services/tasks.service';


@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit, OnDestroy {
  @Input() project: Project;
  @Input() canTranslate = false;
  @Output() taskCreated: EventEmitter<Task | null | undefined> = new EventEmitter(undefined);
  public task: Task;
  private add_task_sub: Subscription;

  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.resetNewTask();

  }



  resetNewTask(): void {
    this.task = new Task();
    this.task.project_id = this.project.id;
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
      (error) => {

      }
    );

  }

  ngOnDestroy() {

    const subs: Subscription[] = [
      this.add_task_sub,
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }


}
