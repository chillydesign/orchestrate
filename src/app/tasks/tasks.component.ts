import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from '../models/project.model';
import { ProjectsOptions, ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {
  public projects: Project[];
  private projects_sub: Subscription;
  constructor(
    private projectsService: ProjectsService
  ) { }

  ngOnInit(): void {
    this.getProjects();
  }
  getProjects(): void {

    const options: ProjectsOptions = { limit: 99999, status: 'active', include_tasks: true };
    this.projects_sub = this.projectsService.getProjects(options).subscribe(
      (projects: Project[]) => {
        if (projects) {
          this.projects = projects.filter(p => p.tasks.length > 0);
        }
      }
    );
  }



  ngOnDestroy() {

    const subs: Subscription[] = [
      this.projects_sub,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }


}
