import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { Project } from 'src/app/models/project.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CsvService } from 'src/app/services/csv.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { TasksService } from 'src/app/services/tasks.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';
import { Task } from 'zone.js/lib/zone-impl';

@Component({
  selector: 'app-project-with-cards',
  templateUrl: './project-with-cards.component.html',
  styleUrl: './project-with-cards.component.scss'
})
export class ProjectWithCardsComponent implements OnInit, OnDestroy {

  public current_user: User;
  public project_slug: string;
  public project_id: number;
  public client: Client;
  public project: Project;
  public title = environment.site_name;

  private route_params_subscription: Subscription;
  private delete_project_sub: Subscription;
  private project_sub: Subscription;
  private drag_sub: Subscription;
  private update_project_sub: Subscription;
  private current_user_subscription: Subscription;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private projectsService: ProjectsService,
    private authService: AuthService,
    private usersService: UsersService,
    private csvService: CsvService,
    private router: Router) { }




  ngOnInit() {
    this.subscribeToRoute();

  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe({
      next: (user: User) => {
        this.current_user = user;
      }
    });
  }


  subscribeToRoute(): void {
    this.route_params_subscription = this.route.params.subscribe({
      next: (params: Params) => {
        if (params.id) {
          this.project_id = params.id;
          this.getProject();
        } else if (params.project_slug) {
          this.project_slug = params.project_slug;
          this.getProjectFromSlug();
        }
      }
    });

  }




  getProjectFromSlug(): void {
    this.project_sub = this.projectsService.getProjectFromSlug(this.project_slug).subscribe(
      (project: Project) => {
        if (project) {
          this.project = project;
          this.processProject();

        }
      }
    );
  }


  getProject(): void {
    this.project_sub = this.projectsService.getProject(this.project_id).subscribe(
      (project: Project) => {
        if (project) {
          this.project = project;
          this.processProject();
        }
      }
    );
  }

  processProject(): void {
    this.client = this.project.client;
    this.projectsService.current_project_client.next(this.client);
    this.titleService.setTitle(`${this.project.nice_name} | ${this.title} `);
  }

  refreshProject(): void {
    this.project = null;
    if (this.project_slug) {
      this.getProjectFromSlug()
    } else {
      this.getProject();

    }
  }


  taskUpdated(newtask: Task): void {
  }
  removeOldTask(task: Task): void {
  }




  ngOnDestroy() {

    const subs: Subscription[] = [
      this.route_params_subscription,
      this.project_sub,
      this.delete_project_sub,
      this.drag_sub,
      this.update_project_sub,
      this.current_user_subscription,

    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });


  }

}
