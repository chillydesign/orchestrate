import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectsOptions, ProjectsService } from '../services/projects.service';
import { Project } from '../models/project.model';
import { Params, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  public current_user: User;
  public projects: Project[];
  public visible_projects: Project[];
  public offset = 0;
  public limit = 20;
  public status = 'active';
  public load_more = false;
  public loading = false;
  public search_term: string;
  private projects_sub: Subscription;
  private route_params_subscription: Subscription;
  private current_user_subscription: Subscription;
  constructor(
    private projectsService: ProjectsService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getCurrentUser();

  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;
        this.setStatus();
      }
    );
  }

  setStatus(): void {
    // allow user to get projects of a particular status, based on the url
    this.route_params_subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params.status === undefined) {
          this.status = 'active';
        } else {
          this.status = params.status;
        }
        this.refreshProjects();
      }
    ); // end of route_params_subscription
  }


  refreshProjects(): void {
    this.projects = [];
    this.visible_projects = null;
    this.load_more = false;
    this.offset = 0;
    this.getProjects();
  }



  getProjects(): void {

    if (this.loading === false) {
      this.loading = true;
      const options: ProjectsOptions = { offset: this.offset, limit: this.limit, status: this.status };
      this.projects_sub = this.projectsService.getProjects(options).subscribe(
        (projects: Project[]) => {
          if (projects) {
            projects.forEach(p => this.projects.push(p));
            this.offset += this.limit;
            this.load_more = (projects.length === this.limit);
            this.loading = false;
            this.onSearch();
          }
        }
      );
    }
  }

  onSearch(): void {
    if (this.search_term) {
      const s = this.search_term.toLowerCase();
      this.visible_projects = this.projects.filter((p) => {
        return p.name.toLowerCase().includes(s);
      });
    } else {
      this.visible_projects = this.projects;
    }

  }

  loadMore(): void {
    this.load_more = false;
    this.getProjects();
  }




  ngOnDestroy() {

    const subs: Subscription[] = [
      this.projects_sub,
      this.current_user_subscription,
      this.route_params_subscription,
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }




}
