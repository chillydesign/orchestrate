import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Client } from '../models/client.model';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ClientsService } from '../services/clients.service';
import { CsvService } from '../services/csv.service';
import { ExportOptions, ProjectsService } from '../services/projects.service';
import { TasksService } from '../services/tasks.service';



@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  public search_properties: ExportOptions = {
    client_id: null,
    project_id: null,
    is_approved: 'yes',
    completed: 'yes',
    start_date: null,
    end_date: null,
  }
  public current_user: User;
  public all_projects: Project[];
  public projects: Project[];
  public clients: Client[];
  public formLoading = false;
  public formSuccess = false;
  public canSubmitForm = false;
  public errors: Subject<object> = new Subject();
  private export_sub: Subscription;
  private clients_sub: Subscription;
  private projects_sub: Subscription;
  private current_user_subscription: Subscription;

  constructor(
    private authService: AuthService,
    private clientsService: ClientsService,
    private projectsService: ProjectsService,
    private tasksService: TasksService,
    private csvService: CsvService,
  ) { }


  ngOnInit(): void {
    this.getCurrentUser();
  }


  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;

        if (user) {
          this.getClients();

        }

      }
    );
  }


  getClients(): void {
    this.clients_sub = this.clientsService.getClients().subscribe(
      (clients: Client[]) => {
        if (clients) {
          this.clients = clients;
          this.getProjects();
        }
      }
    );
  }
  getProjects(): void {
    const options = { offset: 0, limit: 999999 };
    this.projects_sub = this.projectsService.getProjects(options).subscribe(
      (projects: Project[]) => {
        if (projects) {
          this.all_projects = projects;
        }
      }
    );
  }


  onClientChange(event): void {
    this.projects = this.all_projects.filter(p => p.client_id === this.search_properties.client_id);
  }

  onSubmit(): void {

    if (this.current_user) {
      const opts: ExportOptions = (this.search_properties);

      this.export_sub = this.projectsService.getProjectsCSV(opts).subscribe(
        (csv_file: string) => {
          this.csvService.downloadCSVFromString(csv_file, `project_exports`);
        }
      );

    }

  }

  ngOnDestroy() {

    const subs: Subscription[] = [
      this.current_user_subscription,
      this.clients_sub,
      this.projects_sub,
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }

}
