import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { Project } from 'src/app/models/project.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClientsService } from 'src/app/services/clients.service';
import { ProjectsOptions, ProjectsService } from 'src/app/services/projects.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, OnDestroy {
  public client: Client;
  public current_user: User;
  public users: User[];
  public title = environment.site_name;
  public getting_client = false;
  public project_id: number;
  public show_mode: ('incomplete' | 'unapproved' | 'all') = 'all';
  public show_incomplete: boolean = false;
  public show_unapproved: boolean = true;
  public client_id: number;
  public status = 'active';
  public client_slug: string;
  public projects: Project[];
  private client_sub: Subscription;
  private projects_sub: Subscription;
  private users_sub: Subscription;
  private current_user_subscription: Subscription;
  private route_params_subscription: Subscription;
  constructor(
    private clientsService: ClientsService,
    private authService: AuthService,
    private titleService: Title,
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;
        this.subscribeToRoute();

      }
    );
  }


  reshowTasks(e: boolean): void {
    if (e === true) {
      this.changeVisibleTasks();
    }
  }



  subscribeToRoute(): void {
    if (!this.getting_client) {
      this.getting_client = true;
      this.route_params_subscription = this.route.params.subscribe(
        (params: Params) => {

          if (params.project_id) {
            this.project_id = params.project_id;
          }

          if (params.status) {
            this.status = params.status;
          } else {
            this.status = 'active';
          }

          if (params.id) {
            this.client_id = params.id;
            this.getClient();
          } else if (params.slug) {
            this.client_slug = params.slug;
            this.getClientFromSlug();
          }



        }
      ); // end of route_params_subscription
    }
  }

  getClient(): void {
    this.client_sub = this.clientsService.getClient(this.client_id).subscribe(
      (client: Client) => {
        if (client) {
          this.client = client;
          this.projectsService.current_project_client.next(client);
          this.getProjects();
          this.titleService.setTitle(`${this.client.name} | ${this.title}`);

        }
      }
    );
  }


  getClientFromSlug(): void {
    this.client_sub = this.clientsService.getClientFromSlug(this.client_slug).subscribe(
      (client: Client) => {
        if (client) {
          this.client = client;
          this.projectsService.current_project_client.next(client);
          this.getProjects();
          this.titleService.setTitle(`${this.client.name}  | ${this.title}`);


        }
      }
    );
  }

  getProjects(): void {
    const options: ProjectsOptions = { status: this.status, client_id: this.client.id, include_tasks: true, include_comments: true };
    this.projects_sub = this.projectsService.getProjects(options).subscribe(
      (projects: Project[]) => {
        if (projects) {
          this.projects = projects;
          this.projects.map(p => p.client = this.client);

          this.loadViewOptionsFromLocalStorage();


          this.scrollToProject();

          this.getUsers();
        }
      }
    );
  }

  scrollToProject(): void {
    if (this.project_id) {

      setTimeout(() => {
        const p = document.getElementById(`project_${this.project_id}`);
        if (p) {
          p.scrollIntoView();
        }
      }, 250);


    }
  }


  getUsers(): void {
    this.users_sub = this.usersService.getUsers().subscribe(
      (users: User[]) => {
        if (users) {
          this.users = users;
        }
        // this.processTasks();
      }
    );
  }


  toggleCollapse(): void {
    const co_count = this.projects.filter(p => p.collapsed === true).length;
    const un_count = this.projects.filter(p => p.collapsed !== true).length;
    const col = (co_count < un_count);

    this.projects.forEach(p => {
      p.collapsed = col;
    })
  }

  refreshProjects(): void {
    this.projects = [];
    this.getProjects();
  }


  changeShowMode(mode: 'incomplete' | 'unapproved' | 'all') {
    this.show_mode = mode;
    this.changeVisibleTasks();
  }

  changeVisibleTasks(): void {


    const ac = (this.show_incomplete) ? [false] : [true, false, null];
    const aa = (this.show_unapproved) ? [false] : [true, false, null];


    this.projects.forEach(project => {
      project.visible_tasks = project.tasks.filter(t => {
        return ac.includes(t.completed) && aa.includes(t.is_approved);
      })
    });

    // if (this.show_mode == 'incomplete') {
    //   this.projects.forEach(project => {
    //     project.visible_tasks = project.tasks.filter(t => t.completed === false)
    //   });
    // } else if (this.show_mode == 'unapproved') {
    //   this.projects.forEach(project => {
    //     project.visible_tasks = project.tasks.filter(t => t.is_approved === false)
    //   });
    // } else {
    //   this.projects.forEach(project => {
    //     project.visible_tasks = project.tasks;
    //   });
    // }
  }





  toggleStep(view_type: string): void {
    if (view_type === 'incomplete') {
      this.show_incomplete = !this.show_incomplete;
    } else if (view_type === 'unapproved') {
      this.show_unapproved = !this.show_unapproved;
    }
    this.storeCurrentViewOptions();

    this.changeVisibleTasks();

  }


  loadViewOptionsFromLocalStorage(): void {
    const orch_show_incomplete: boolean = localStorage.getItem('orch_show_incomplete') === 'true';
    const orch_show_unapproved: boolean = localStorage.getItem('orch_show_unapproved') !== 'false';


    this.show_incomplete = orch_show_incomplete;
    this.show_unapproved = orch_show_unapproved;


    this.changeVisibleTasks();



  }

  storeCurrentViewOptions(): void {


    localStorage.setItem('orch_show_incomplete', this.show_incomplete.toString());
    localStorage.setItem('orch_show_unapproved', this.show_unapproved.toString());


  }




  ngOnDestroy() {
    const subs: Subscription[] = [
      this.client_sub,
      this.projects_sub,
      this.current_user_subscription,
      this.users_sub,
      this.route_params_subscription,

    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
