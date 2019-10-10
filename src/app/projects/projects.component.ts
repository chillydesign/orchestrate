import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../models/project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  public projects: Project[];
  private projects_sub: Subscription;

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() {

    this.getProjects();
  }


  getProjects(): void {
    this.projects_sub = this.projectsService.getProjects().subscribe(
      (projects: Project[]) => {
        if (projects) {
          this.projects = projects;
        }
      }
    );
  }


  ngOnDestroy() {

    const subs: Subscription[] = [
      this.projects_sub
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }

}
