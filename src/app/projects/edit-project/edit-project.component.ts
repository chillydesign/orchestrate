import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { Subscription, Subject } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit, OnDestroy {

  public project: Project;
  public formLoading = false;
  public formSuccess = false;
  public canSubmitForm = false;
  public errors: Subject<object> = new Subject();
  private route_params_subscription: Subscription;
  private delete_project_sub: Subscription;
  private project_sub: Subscription;
  private update_project_sub: Subscription;
  constructor(private route: ActivatedRoute, private projectsService: ProjectsService, private router: Router) { }

  ngOnInit() {

    this.route_params_subscription = this.route.params.subscribe(
      (params: Params) => {
        this.getProject(params.id);
      }
    ); // end of route_params_subscription


  }

  getProject(project_id: number): void {
    this.project_sub = this.projectsService.getProject(project_id).subscribe(
      (project: Project) => {
        if (project) {
          this.project = project;
        }
      }
    );
  }


  onFormChange(): void {
    // let server figure out if object is valid
    this.canSubmitForm = true;

  }

  onSubmit(): void {

    this.onFormChange();

    if (this.canSubmitForm) {

      this.formLoading = true;

      this.update_project_sub = this.projectsService.updateProject(this.project).subscribe(
        (project: Project) => {
          this.formLoading = false;
          this.formSuccess = true;
          this.errors.next(null);
        },
        (error) => {
          this.errors.next(error.error);
          this.formLoading = false;
          this.formSuccess = false;
        }
      );
    }
  }


  ngOnDestroy() {
    const subs: Subscription[] = [
      this.route_params_subscription,
      this.project_sub,
      this.delete_project_sub,

    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }

}
