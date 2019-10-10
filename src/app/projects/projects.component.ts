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
  public projects: Project[] = [];
  public offset = 0;
  public limit = 10;
  public load_more = false;
  public loading = false;
  private projects_sub: Subscription;

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() {

    this.getProjects();
  }


  getProjects(): void {

    if (this.loading === false) {
      this.loading = true;
      this.projects_sub = this.projectsService.getProjects({ offset: this.offset, limit: this.limit }).subscribe(
        (projects: Project[]) => {
          if (projects) {
            projects.forEach(p => this.projects.push(p));
            this.offset += this.limit;
            this.load_more = (projects.length === this.limit);
            this.loading = false;
          }
        }
      );
    }

  }

  loadMore(): void {
    this.load_more = false;
    this.getProjects();
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
