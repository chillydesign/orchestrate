import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';
import { Project } from 'src/app/models/project.model';
import { Task } from 'src/app/models/task.model';
import { Title } from '@angular/platform-browser';
import { DragulaService } from 'ng2-dragula';
import { TasksService } from 'src/app/services/tasks.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
  public project: Project;
  private route_params_subscription: Subscription;
  private delete_project_sub: Subscription;
  private project_sub: Subscription;
  private drag_sub: Subscription;
  private update_project_sub: Subscription;
  private url_sub: Subscription;
  private update_task_sub: Subscription;
  public title = environment.site_name;
  public canAdministrate = false;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private projectsService: ProjectsService,
    private dragulaService: DragulaService,
    private router: Router) {

    // add a handle to the dragdrop
    this.dragulaService.createGroup('TASKS', {
      moves(el, container, handle) {
        return handle.className === 'handle';
      }
    });

  }

  ngOnInit() {

    this.route_params_subscription = this.route.params.subscribe(
      (params: Params) => {
        this.getProject(params.id);
      }
    ); // end of route_params_subscription


    // if url string contains translate or translation, allow tasks to be translated
    this.url_sub = this.route.url.subscribe(
      (segments: UrlSegment[]) => {
        const sgs = segments.map(s => s.path);
        this.canAdministrate = (sgs.includes('translate') || sgs.includes('translation') || sgs.includes('admin'));
      }
    );


  }

  getProject(project_id: number): void {
    this.project_sub = this.projectsService.getProject(project_id).subscribe(
      (project: Project) => {
        if (project) {
          this.project = project;
          this.titleService.setTitle(`${this.project.name} | ${this.title} `);
          this.setupDragSubscription();
          this.processTasks();
        }
      }
    );
  }

  deleteProject(): void {
    if (confirm(`Are you sure you want to delete this project?`)) {
      this.delete_project_sub = this.projectsService.deleteProject(this.project).subscribe(
        () => {
          this.router.navigate(['/']);
        },
        (error) => {

        }
      );
    }

  }



  archiveProject(): void {
    if (this.project.status !== 'inactive') {
      this.project.status = 'inactive';
      this.update_project_sub = this.projectsService.updateProject(this.project).subscribe(
        () => alert('This project has been archived'),
        (error) => console.log(error)
      );
    }
  }

  taskUpdated(newtask: Task): void {
    const task = this.project.tasks.find(t => t.id === newtask.id);
    if (task) {
      task.completed = newtask.completed;
    }
    this.setPercentage();
  }

  addNewTask(task: Task): void {
    this.project.tasks.push(task);
    this.setPercentage();
  }

  removeOldTask(task: Task): void {
    this.project.tasks = this.project.tasks.filter(t => t.id !== task.id);
    this.setPercentage();
  }

  setPercentage(): void {
    this.project.setTasksCount();
  }


  processTasks(): void {
    const ups = this.project.uploads;
    this.project.tasks.forEach(task => {
      task.uploads = ups.filter(u => u.task_id === task.id);
    });

  }

  setupDragSubscription(): void {
    this.drag_sub = this.dragulaService.dropModel('TASKS').subscribe(({ sourceModel, targetModel, item }) => {
      const new_docsecs = targetModel;
      new_docsecs.forEach((new_task, i) => {
        setTimeout(() => {
          const new_ordering = i + 1;
          const current_task = this.project.tasks.find((task) => task.id === new_task.id);
          if (current_task) {
            if (current_task.ordering !== new_ordering) {
              current_task.ordering = new_ordering;
              this.update_task_sub = this.tasksService.updateTask(current_task).subscribe();
            }
          }
        }, i * 500);
      });
    });
  }

  ngOnDestroy() {

    const subs: Subscription[] = [
      this.route_params_subscription,
      this.project_sub,
      this.delete_project_sub,
      this.drag_sub,
      this.update_project_sub,
      this.update_task_sub,
      this.url_sub,

    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

    this.dragulaService.destroy('TASKS');

  }


}