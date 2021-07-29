import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';
import { TasksService } from 'src/app/services/tasks.service';
import { Project } from 'src/app/models/project.model';
import { Upload } from 'src/app/models/upload.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task: Task;
  @Input() project: Project;
  @Input() users: User[];
  @Input() canAdministrate = false;
  @Input() canDelete = true;
  @Output() taskDeleted: EventEmitter<Task | null | undefined> = new EventEmitter(undefined);
  @Output() taskUpdated: EventEmitter<Task | null | undefined> = new EventEmitter(undefined);
  @Output() addTaskBelowme: EventEmitter<Task | null | undefined> = new EventEmitter(undefined);
  // @Output() showTaskComments: EventEmitter<Task | null | undefined> = new EventEmitter(undefined);
  public showUpload = false;
  public showTick = false;
  public showComments = false;
  public updating = false;
  private update_task_sub: Subscription;
  private delete_task_sub: Subscription;
  public time_options: { amount: number, translation: string }[] = this.tasksService.timeOptions();
  constructor(private tasksService: TasksService) { }

  ngOnInit() {
  }


  onSubmit(): void {
    this.showTick = false;
    // dont do an update til the last update has finished
    if (this.updating === false) {
      this.updating = true;
      const upl = this.task.uploads;
      this.update_task_sub = this.tasksService.updateTask(this.task).subscribe(
        (task: Task) => {
          this.task = task;
          this.task.uploads = upl;
          this.taskUpdated.next(this.task);
          this.updating = false;
          this.showTickIcon();
        },
        (error) => {

        }
      );
    }
  }


  showTickIcon(): void {
    this.showTick = true;
    setTimeout(() => {
      this.showTick = false;
    }, 2000);
  }

  toggleCompleted(): void {
    this.task.completed = !this.task.completed;
    this.onSubmit();

  }

  toggleCurrent(): void {
    this.task.is_current = !this.task.is_current;
    this.onSubmit();
  }


  addTaskBelow(): void {
    this.addTaskBelowme.emit(this.task);
  }





  updateContent(event) {
    this.task.content = event.target.textContent;
    this.onSubmit();
  }
  updateTimeTaken(event) {
    this.task.time_taken = event.target.textContent;
    this.onSubmit();
  }

  updateTranslation(event) {
    this.task.translation = event.target.textContent;
    this.onSubmit();
  }

  saveTaskOnEnter(event) {

    if (event.key === 'Enter') {

      this.onSubmit();
      return false;
    }
  }



  toggleIndentation(): void {
    // 1 0    // 0 1
    // this.task.indentation = (this.task.indentation + 1) % 2;

    if (this.task.is_title) {
      this.task.is_title = false;
      this.task.indentation = 0;
    } else if (this.task.indentation === 0) {
      this.task.indentation = 1;
      this.task.is_title = false;
    } else if (this.task.indentation === 1) {
      this.task.is_title = true;
      this.task.indentation = 0;
    }

    this.onSubmit();
  }

  assignTo(user: User): void {
    if (this.task.assignee_id !== user.id) {
      this.task.assignee_id = user.id;
    } else {
      this.task.assignee_id = null;
    }
    this.onSubmit();
  }

  togglePriority(): void {
    // 1 0    // 0 1
    this.task.priority = (this.task.priority + 1) % 2;
    this.onSubmit();
  }

  deleteTask(): void {
    if (confirm('Are you sure?')) {
      this.delete_task_sub = this.tasksService.deleteTask(this.task).subscribe(
        () => {
          this.taskDeleted.next(this.task);
        },
        (error) => {

        }
      );
    }
  }


  toggleUpload(): void {
    this.showUpload = !this.showUpload;
  }

  showCommentPopup(): void {
    // this.showTaskComments.next(this.task);
    this.showComments = true;
  }

  hideComments(hide: boolean): void {

    this.showComments = false;
  }


  createdUpload(newupload: Upload): void {
    this.task.uploads.push(newupload);
    this.showUpload = false;
  }


  ngOnDestroy() {
    const subs: Subscription[] = [
      this.update_task_sub,
      this.delete_task_sub,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }


}
