import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ProjectsService } from '../services/projects.service';
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public tasks: Task[];
  public projects: Project[];
  public current_user: User;
  private current_user_subscription: Subscription;
  private tasks_sub: Subscription;
  private projects_sub: Subscription;
  constructor(
    private authService: AuthService,
    private projectsService: ProjectsService,
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }



  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        if (user) {
          this.current_user = user;
          this.getTasks();
        }

      }
    );
  }



  getTasks(): void {


    this.projects_sub = this.projectsService.getProjects({ assignee: this.current_user, current: true }).subscribe(
      (projects: Project[]) => {
        if (projects) {
          this.projects = projects;
        }
      }
    );
  }

  removeOldTask(task: Task): void {
    const project = this.projects.find(pr => pr.id === task.project_id);
    project.tasks = project.tasks.filter(t => t.id !== task.id);
  }




  ngOnDestroy() {
    const subs: Subscription[] = [
      this.current_user_subscription,
      this.projects_sub,
      this.tasks_sub,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

}
