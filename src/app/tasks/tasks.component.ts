import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ProjectsOptions, ProjectsService } from '../services/projects.service';
import { TasksOptions, TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {
  public projects: Project[];
  public tasks: Task[];
  public current_user: User;
  private projects_sub: Subscription;
  private tasks_sub: Subscription;
  private current_user_subscription: Subscription;
  constructor(
    private projectsService: ProjectsService,
    private authService: AuthService,
    private tasksService: TasksService,
  ) { }

  ngOnInit(): void {
    // this.getProjects();
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;

        if (user) {
          this.getTasks();

        }

      }
    );
  }



  getTasks(): void {

    const opts: TasksOptions = { limit: 30, order: 'created_at', completed: 0 };
    this.tasks_sub = this.tasksService.getTasks(opts).subscribe(
      (tasks: Task[]) => {
        if (tasks) {
          this.tasks = tasks;
        }
      }
    );
  }




  // getProjects(): void {

  //   const options: ProjectsOptions = { limit: 99999, status: 'active', include_tasks: true };
  //   this.projects_sub = this.projectsService.getProjects(options).subscribe(
  //     (projects: Project[]) => {
  //       if (projects) {
  //         this.projects = projects.filter(p => p.tasks.length > 0);
  //       }
  //     }
  //   );
  // }



  ngOnDestroy() {

    const subs: Subscription[] = [
      this.projects_sub,
      this.tasks_sub,
      this.current_user_subscription,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }


}
