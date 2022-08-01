import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
// import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/project.model';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CsvService } from 'src/app/services/csv.service';
import { ExportOptions, ProjectsService } from 'src/app/services/projects.service';
import { TasksService } from 'src/app/services/tasks.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-project-whole',
  templateUrl: './project-whole.component.html',
  styleUrls: ['./project-whole.component.scss']
})
export class ProjectWholeComponent implements OnInit, OnDestroy {
  @Input() project: Project;
  @Input() users: User[];
  @Output() task_added: EventEmitter<boolean> = new EventEmitter(false);
  public current_user: User;
  private update_project_sub: Subscription;
  private delete_project_sub: Subscription;
  private update_task_sub: Subscription;
  private current_user_subscription: Subscription;
  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private projectsService: ProjectsService,
    private authService: AuthService,
    private usersService: UsersService,
    // private dragulaService: DragulaService,
    private csvService: CsvService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }


  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;

        this.processTasks();
      }
    );
  }


  deleteProject(): void {
    if (confirm(`Are you sure you want to delete this project?`)) {
      this.delete_project_sub = this.projectsService.deleteProject(this.project).subscribe(
        () => {
          // this.router.navigate(['/']);
          this.project = null;
        },
        (error) => {

        }
      );
    }

  }

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


  exportProject(): void {
    const opts: ExportOptions = { project_id: this.project.id };
    this.projectsService.getProjectsCSV(opts).subscribe(
      (csv_file: string) => {
        this.csvService.downloadCSVFromString(csv_file, `project_${this.project.id}`);
      }
    );
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
    this.task_added.next(true);

  }

  removeOldTask(task: Task): void {
    this.project.visible_tasks = this.project.visible_tasks.filter(t => t.id !== task.id);
    this.setPercentage();

  }





  setPercentage(): void {
    this.project.setTasksCount();
    this.project.setTotalMinutes();
  }


  processTasks(): void {
    // console.log('here', Math.random());
    // const ups = this.project.uploads;
    // if (ups) {
    //   this.project.tasks.forEach(task => {
    //     task.uploads = ups.filter(u => u.task_id === task.id);

    //     console.log(task.uploads);
    //     // if (this.users) {
    //     //   task.assignee = this.users.find(u => u.id === task.assignee_id);
    //     // }

    //   });
    // }


    // if (!this.current_user) {
    //   this.project.tasks = this.project.tasks.filter(t => t.is_public === true)
    //   this.project.visible_tasks = this.project.tasks.filter(t => t.is_public === true)
    // }


  }


  collapseProject(): void {
    this.project.collapsed = !this.project.collapsed;
  }

  ngOnDestroy() {
    const subs: Subscription[] = [
      this.current_user_subscription,
      this.update_project_sub,
      this.update_task_sub,
      this.delete_project_sub,

    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }


}
