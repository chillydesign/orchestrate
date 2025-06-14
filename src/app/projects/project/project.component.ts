import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';
import { Project } from 'src/app/models/project.model';
import { Task } from 'src/app/models/task.model';
import { Title } from '@angular/platform-browser';
// import { DragulaService } from 'ng2-dragula';
import { TasksService } from 'src/app/services/tasks.service';
import { environment } from '../../../environments/environment';
import { CsvService } from 'src/app/services/csv.service';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { Client } from 'src/app/models/client.model';
import { ClientsService } from 'src/app/services/clients.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
  public current_user: User;
  public users: User[];
  public project_slug: string;
  public project_id: number;
  public client: Client;
  public project: Project;
  public show_incomplete: boolean = false;
  public show_unapproved: boolean = true;
  private route_params_subscription: Subscription;
  private delete_project_sub: Subscription;
  private project_sub: Subscription;
  private drag_sub: Subscription;
  private update_project_sub: Subscription;
  private current_user_subscription: Subscription;
  private users_sub: Subscription;
  private url_sub: Subscription;
  private update_task_sub: Subscription;
  public title = environment.site_name;


  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private projectsService: ProjectsService,
    private authService: AuthService,
    private usersService: UsersService,
    // private dragulaService: DragulaService,
    private csvService: CsvService,
    private router: Router) {

    // // add a handle to the dragdrop
    // this.dragulaService.createGroup('TASKS', {
    //   moves(el, container, handle) {
    //     return handle.classList.contains('handle');
    //   }
    // });

  }

  // add this to angular.json if you want to put dragula bacl
  // "architect": {
  //   "build": {
  //     "options": {
  //       "allowedCommonJsDependencies": [
  //         "dragula"
  //       ],

  ngOnInit() {
    this.subscribeToRoute();

  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe({
      next: (user: User) => {
        this.current_user = user;
      },
      complete: () => {
        this.subscribeToRoute();
      }
    });
  }


  subscribeToRoute(): void {
    this.route_params_subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params.id) {
          this.project_id = params.id;
          this.getProject();
        } else if (params.project_slug) {
          this.project_slug = params.project_slug;
          this.getProjectFromSlug();
        }
      }
    );

  }




  getProjectFromSlug(): void {
    this.project_sub = this.projectsService.getProjectFromSlug(this.project_slug).subscribe(
      (project: Project) => {
        if (project) {
          this.project = project;
          this.processProject();

        }
      }
    );
  }


  getProject(): void {
    this.project_sub = this.projectsService.getProject(this.project_id).subscribe(
      (project: Project) => {
        if (project) {
          this.project = project;
          this.processProject();
        }
      }
    );
  }


  processProject(): void {
    this.client = this.project.client;
    this.projectsService.current_project_client.next(this.client);
    this.titleService.setTitle(`${this.project.nice_name} | ${this.title} `);
    this.getUsers();
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



  deleteProject(): void {
    if (confirm(`Are you sure you want to delete this project?`)) {
      this.delete_project_sub = this.projectsService.deleteProject(this.project).subscribe(
        () => {
          this.router.navigate(['/']);
        },
        (error) => {

        }
      );
    }

  }


  exportProject(): void {
    const opts = { project_id: this.project.id }
    this.projectsService.getProjectsCSV(opts).subscribe(
      (csv_file: string) => {
        this.csvService.downloadCSVFromString(csv_file, `project_${this.project.id}`);
      }
    );
  }



  toggleStep(view_type: string): void {
    if (view_type === 'incomplete') {
      this.show_incomplete = !this.show_incomplete;
    } else if (view_type === 'unapproved') {
      this.show_unapproved = !this.show_unapproved;
    }

    this.changeVisibleTasks();

  }



  changeVisibleTasks(): void {


    const ac = (this.show_incomplete) ? [false] : [true, false, null];
    const aa = (this.show_unapproved) ? [false] : [true, false, null];


    this.project.visible_tasks = this.project.tasks.filter(t => {
      return ac.includes(t.completed) && aa.includes(t.is_approved);
    })

  }


  archiveProject(): void {
    if (this.project.status !== 'inactive') {
      this.project.status = 'inactive';
      this.update_project_sub = this.projectsService.updateProject(this.project).subscribe(
        () => alert('This project has been archived'),
        (error) => console.log(error)
      );
    }
  }

  taskUpdated(newtask: Task): void {
    const task = this.project.tasks.find(t => t.id === newtask.id);
    if (task) {
      task.completed = newtask.completed;
      task.time_taken = newtask.time_taken;
    }
    this.setPercentage();
  }

  addTaskBelow(task: Task): void {
    // console.log(task.ordering);
    // console.log(task.ordering);
    // const new_task = new Task();
    // new_task.ordering = task.ordering += 0.5;
    // new_task.project_id = task.project_id;
    // this.addNewTask(new_task);
  }

  addNewTask(task: Task): void {
    this.project.tasks.push(task);
    this.setPercentage();
  }

  removeOldTask(task: Task): void {
    this.project.tasks = this.project.tasks.filter(t => t.id !== task.id);
    this.setPercentage();
  }





  setPercentage(): void {
    this.project.setTasksCount();
    this.project.setTotalMinutes();
  }


  processTasks(): void {
    const ups = this.project.uploads;
    this.project.tasks.forEach(task => {
      task.uploads = ups.filter(u => u.task_id === task.id);

      // if (this.users) {
      //   task.assignee = this.users.find(u => u.id === task.assignee_id);
      // }

    });

  }

  // setupDragSubscription(): void {
  //   this.drag_sub = this.dragulaService.dropModel('TASKS').subscribe(({ sourceModel, targetModel, item }) => {
  //     const new_docsecs = targetModel;
  //     new_docsecs.forEach((new_task, i) => {
  //       setTimeout(() => {
  //         const new_ordering = i + 1;
  //         const current_task = this.project.tasks.find((task) => task.id === new_task.id);
  //         if (current_task) {
  //           if (current_task.ordering !== new_ordering) {
  //             current_task.ordering = new_ordering;
  //             this.update_task_sub = this.tasksService.updateTask(current_task).subscribe();
  //           }
  //         }
  //       }, i * 500);
  //     });
  //   });
  // }

  assignUnassignedTo(user: User): void {

    const unassigned = this.project.tasks.filter(t => t.assignee_id === null || t.assignee_id === 0);
    const undone = unassigned.filter(t => t.completed === false);
    undone.forEach((task, i) => {
      setTimeout(() => {
        task.assignee_id = user.id;
        task.assignee = user;

        this.update_task_sub = this.tasksService.updateTask(task).subscribe();
      }, i * 500);
    });
  }


  refreshProject(): void {
    this.project = null;
    if (this.project_slug) {
      this.getProjectFromSlug()
    } else {
      this.getProject();

    }
  }



  ngOnDestroy() {

    const subs: Subscription[] = [
      this.route_params_subscription,
      this.project_sub,
      this.delete_project_sub,
      this.drag_sub,
      this.users_sub,
      this.update_project_sub,
      this.current_user_subscription,
      this.update_task_sub,
      this.url_sub,

    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

    // this.dragulaService.destroy('TASKS');

  }


}
