import { Component, OnInit, Input, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { Project } from 'src/app/models/project.model';
import { Task } from 'src/app/models/task.model';
import { ClientsService } from 'src/app/services/clients.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-move-task',
  templateUrl: './move-task.component.html',
  styleUrls: ['./move-task.component.scss']
})
export class MoveTaskComponent implements OnInit, OnDestroy {
  @Input() task: Task;
  @Input() project: Project;
  @Output() hide_lightbox: EventEmitter<boolean | null | undefined> = new EventEmitter(undefined);
  public projects: Project[];
  public formLoading = false;
  public formSuccess = false;
  public canSubmitForm = false;
  public errors: Subject<object> = new Subject();
  private projects_sub: Subscription;
  private update_task_sub: Subscription;
  constructor(
    private clientsService: ClientsService,
    private tasksService: TasksService,
    private projectsService: ProjectsService,
  ) { }

  ngOnInit(): void {

    this.getClient();
  }

  getClient(): void {
    this.projects_sub = this.projectsService.getProjects({ client_id: this.project.client_id }).subscribe(
      (projects: Project[]) => {
        this.projects = projects;

      }
    );
  }


  hideLightbox(): void {
    this.hide_lightbox.next(true);
  }


  onSubmit(): void {
    this.formSuccess = false;
    this.update_task_sub = this.tasksService.updateTaskField(this.task, 'project_id').subscribe(
      new_task => {
        this.formSuccess = true;
      },
      error => {
        this.errors.next(error.error);
      }
    );

  }



  // on press enter, call checkQuestion or moveToNextQuestionOrSummary
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.hideLightbox();
    }
  }


  ngOnDestroy() {
    const subs: Subscription[] = [
      this.projects_sub,
      this.update_task_sub,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

}
