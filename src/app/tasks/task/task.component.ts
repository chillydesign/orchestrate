import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';
import { TasksService } from 'src/app/services/tasks.service';
import { Project } from 'src/app/models/project.model';
import { Upload } from 'src/app/models/upload.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task: Task;
  @Input() project: Project;
  // @Input() users: User[];
  @Input() canAdministrate = true;
  @Input() showProjectLink = false;
  @Input() showDate = false;
  @Output() taskDeleted: EventEmitter<Task | null | undefined> = new EventEmitter(undefined);
  @Output() taskUpdated: EventEmitter<Task | null | undefined> = new EventEmitter(undefined);
  // @Output() addTaskBelowme: EventEmitter<Task | null | undefined> = new EventEmitter(undefined);
  // @Output() showTaskComments: EventEmitter<Task | null | undefined> = new EventEmitter(undefined);
  public showUpload = false;
  public showTick = false;
  public showComments = false;
  public updating = false;
  public menu_open = false;
  public current_user: User;
  public is_admin: boolean;
  public disabled = false;
  public showMoveTask = false;
  public debounce_timer: any;
  public time_options: { amount: number, translation: string }[] = this.tasksService.timeOptions();
  @ViewChild('taskContainer') taskContainer: ElementRef;
  private update_task_sub: Subscription;
  private upload_sub: Subscription;
  private current_user_subscription: Subscription;
  private delete_task_sub: Subscription;
  constructor(
    private tasksService: TasksService,
    private authService: AuthService,
  ) { }



  ngOnInit(): void {
    this.getCurrentUser();
    this.subscribeToTaskOpener();


    setTimeout(() => {
      this.updateTextareaHeights();

    }, 500);


  }




  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;
        this.setDisabled();

        if (user) {
          this.is_admin = this.current_user.is_admin;
        }
      }
    );
  }


  setDisabled(): void {
    if (this.task?.completed === false && this.current_user === null) {
      this.disabled = true;
    }
  }

  subscribeToTaskOpener(): void {
    this.current_user_subscription = this.tasksService.close_task_menu.subscribe(
      (task_id: number) => {
        if (task_id !== this.task.id) {
          this.closeMenu();
        }
      }
    );
  }


  onSubmit(): void {
    this.showTick = false;
    // dont do an update til the last update has finished
    if (this.updating === false) {
      this.updating = true;
      const upl = this.task.uploads;
      this.update_task_sub = this.tasksService.updateTask(this.task).subscribe({
        next: (task: Task) => {
          this.task = task;
          this.task.uploads = upl;
          this.taskUpdated.next(this.task);
          this.updating = false;
          this.showTickIcon();
        },
        error: (error) => {
          this.showOtherEditedError(error);
          this.updating = false;
        },
      }

      );
    }
  }




  updateField(field: string): void {
    this.showTick = false;
    console.log('1283890');
    if (this.updating === false) {
      this.updating = true;
      const upl = this.task.uploads;

      this.update_task_sub = this.tasksService.updateTaskField(this.task, field).subscribe({
        next: (task: Task) => {
          this.task = task;
          this.task.uploads = upl;
          // console.log(this.task.translation, task.translation);
          // this.task[field] = task[field];
          // this.task.updated_at = task.updated_at;
          this.taskUpdated.next(this.task);
          this.updating = false;
          this.showTickIcon();
          this.updateTextareaHeights();

        },
        error: (error) => {
          this.showOtherEditedError(error);
          this.updating = false;
        },
      });
    }
  }

  showOtherEditedError(error): void {
    if (error === `Error - task updated by someone else`) {
      alert(`The task was updated by someone else while you were viewing it. Your change was not saved. Please refresh the page and make the edit again.`)
    } else if (error === `Error - must be logged in to update`) {
      alert(`You must be logged in to update a completed task`);
    } else {
      alert('A general error occured. Please try again.');
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
    this.updateField('completed');

    // this.onSubmit();

  }

  toggleCurrent(): void {
    this.task.is_current = !this.task.is_current;
    this.updateField('is_current');
    // this.onSubmit();
  }
  togglePublic(): void {
    this.task.is_public = !this.task.is_public;
    this.updateField('is_public');
    // this.onSubmit();
  }
  toggleApproved(): void {
    this.task.is_approved = !this.task.is_approved;
    this.updateField('is_approved');
    // this.onSubmit();
  }


  // addTaskBelow(): void {
  //   this.addTaskBelowme.emit(this.task);
  // }



  updateTextareaHeights(): void {
    const ts = this.taskContainer.nativeElement.querySelectorAll('textarea');
    let h: number = -9999;
    ts.forEach(t => {
      t.style.height = null;
      if (t.scrollHeight > h) {
        h = t.scrollHeight;
      }
    })
    if (h > 0) {
      ts.forEach(t => {
        t.style.height = (h + 2) + 'px';
      })
    }
  }


  // updateContent(event) {
  //   this.task.content = event.target.textContent;
  //   this.onSubmit();
  // }
  // updateTimeTaken(event) {
  //   this.task.time_taken = event.target.textContent;
  //   this.onSubmit();
  // }

  // updateTranslation(event) {
  //   this.task.translation = event.target.textContent;
  //   this.onSubmit();
  // }

  // saveTaskOnEnter(event, field: ('content' | 'translation')) {

  //   if (event.key === 'Enter') {

  //     this.onSubmit();
  //     return false;
  //   }
  // }

  updateFieldWithDebounce(field: string): void {


    if (this.debounce_timer) {
      clearTimeout(this.debounce_timer);
    }
    this.debounce_timer = setTimeout(() => {
      this.updateField(field);

    }, 5000);
  }

  updateFieldFromEvent(event, field: ('content' | 'translation')) {

    if (event.type === 'keypress' && event.key === 'Enter') {
      this.task[field] = event.target.textContent;
      this.updateField(field);
      return false;
    } else if (event.type == 'blur') {
      this.task[field] = event.target.textContent;
      this.updateField(field);
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
    this.updateField('indentation');
    // this.onSubmit();
  }

  assignTo(user: User): void {
    if (this.task.assignee_id !== user.id) {
      this.task.assignee_id = user.id;
    } else {
      this.task.assignee_id = null;
    }
    this.updateField('assignee_id');
    // this.onSubmit();
  }

  togglePriority(): void {
    // 1 0    // 0 1
    this.task.priority = (this.task.priority + 1) % 2;
    this.updateField('priority');
    // this.onSubmit();
  }

  deleteTask(): void {
    if (this.canAdministrate) {
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
  }



  toggleMenu(): void {
    this.menu_open = !this.menu_open;
    this.tasksService.close_task_menu.next(this.task.id);
  }

  closeMenu() {
    this.menu_open = false;
  }


  toggleUpload(): void {
    this.showUpload = !this.showUpload;
  }

  showCommentPopup(): void {
    // this.showTaskComments.next(this.task);
    this.showComments = !this.showComments;
  }

  hideComments(hide: boolean): void {

    this.showComments = false;
  }

  hideMoveTask(hide: boolean): void {
    this.showMoveTask = false;
  }




  taskChangedProject(nt: Task): void {
    this.task.project_id = nt.project_id;
    this.taskUpdated.next(this.task);
  }


  moveTask(): void {
    this.showMoveTask = true;
  }


  createdUpload(newupload: Upload): void {
    if (this.task.uploads === undefined) {
      this.task.uploads = [];
    }
    this.task.uploads.push(newupload);
    this.task.uploads_count++;
    this.showUpload = false;
  }

  getUploads(): void {
    this.upload_sub = this.tasksService.getUploads(this.task.id).subscribe(
      (uploads: Upload[]) => {
        this.task.uploads = uploads;
      }
    )
  }


  ngOnDestroy() {
    const subs: Subscription[] = [
      this.update_task_sub,
      this.delete_task_sub,
      this.upload_sub,
      this.current_user_subscription,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }


  // this is incredibly slow when theres lots of task components on page
  // @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
  //   if (this.menu_open) {
  //     if (event.key === 'Escape') {
  //       this.closeMenu();
  //     }
  //   }
  // }
  @HostListener('document:mouseup', ['$event']) onMouseUpHandler(event: any) {
    if (this.menu_open) {
      if (event.target) {
        if (!event.target.classList.contains("actions_opener")) {
          this.closeMenu();
        }
      }
    }

  }


}
