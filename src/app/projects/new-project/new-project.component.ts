import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { ProjectsService } from 'src/app/services/projects.service';
import { Project } from 'src/app/models/project.model';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit, OnDestroy {
  public canSubmitForm = false;
  public formLoading = false;
  public formSuccess = false;
  public project = new Project();
  public errors: Subject<object> = new Subject();
  private add_project_sub: Subscription;

  constructor(private projectsService: ProjectsService, private router: Router) { }

  ngOnInit() {
  }




  onFormChange(): void {
    // let server figure out if object is valid
    this.canSubmitForm = true;

  }

  onSubmit(): void {

    this.onFormChange();

    if (this.canSubmitForm) {

      this.formLoading = true;

      this.add_project_sub = this.projectsService.addProject(this.project).subscribe(
        (project: Project) => {
          this.formLoading = false;
          this.formSuccess = true;
          this.errors.next(null);
          this.router.navigate(['/projects', project.id]);
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

      this.add_project_sub,

    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }
}
