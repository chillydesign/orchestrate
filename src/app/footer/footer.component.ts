import { Component, OnInit } from '@angular/core';
import { TasksService } from '../services/tasks.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public draft_task: string;
  public show = false;
  public current_user: User;
  private current_user_subscription: Subscription;
  constructor(private tasksService: TasksService, private authService: AuthService) { }


  ngOnInit(): void {
    this.getCurrentUser();


  }


  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;
        this.subcribeToDraft();
      }
    );
  }




  subcribeToDraft(): void {
    this.tasksService.taskDraftChanged.subscribe({
      next: (b) => {

        this.draft_task = this.tasksService.getDraftTask();
      }
    })
  }


  showDraft(): void {
    this.show = !this.show;
  }

}
