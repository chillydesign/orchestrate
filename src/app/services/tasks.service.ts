import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private api_url = environment.api_url;
  constructor(private http: HttpClient, private authService: AuthService) { }

  addTask(task: Task): Observable<Task> {
    const options = this.authService.setAPIOptionsNoLogin();
    const data = {
      attributes: {
        content: task.content,
        translation: task.translation,
        project_id: task.project_id,
        ordering: task.ordering,
        time_taken: task.time_taken,
      }
    };
    const endpoint = `${this.api_url}/?route=tasks`;
    return this.http.post<Task>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Task(res))
    );
  }



  updateTask(task: Task): Observable<Task> {
    const options = this.authService.setAPIOptionsNoLogin();
    const endpoint = `${this.api_url}/?route=tasks&id=${task.id}`;
    const data = {
      attributes: {
        content: task.content,
        completed: task.completed,
        translation: task.translation,
        ordering: task.ordering,
        indentation: task.indentation,
        priority: task.priority,
        completed_at: task.completed_at,
        time_taken: task.time_taken,
        is_title: task.is_title,
        is_current: task.is_current,
        assignee_id: task.assignee_id,
      }

    };
    return this.http.patch<Task>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Task(res))
    );
  }



  deleteTask(task: Task): Observable<Task> {
    const options = this.authService.setAPIOptionsNoLogin();
    const endpoint = `${this.api_url}/?route=tasks&id=${task.id}`;
    return this.http.delete<Task>(endpoint, options).pipe(
      catchError(this.authService.handleError)
      // ,
      // tap(() => console.log('deleted task'))
    );
  }


  getCurrentTasks(): Observable<Task[]> {
    const options = this.authService.setAPIOptionsNoLogin();
    const endpoint = `${this.api_url}/?route=tasks&is_current=true`;
    return this.http.get<Task[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((p: Task) => new Task(p)))
    );
  }

  getTasksCompletedToday(): Observable<Task[]> {
    const options = this.authService.setAPIOptionsNoLogin();
    const endpoint = `${this.api_url}/?route=tasks&completed_today=true`;
    return this.http.get<Task[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((p: Task) => new Task(p)))
    );
  }



  timeOptions(): { amount: number, translation: string }[] {

    const options = [
      { amount: 0, translation: `-` }
    ];

    let amount = 5;
    while (amount <= 720) {

      const mins: number = amount % 60;
      const hours: number = (amount - mins) / 60;
      const translationArray = [];
      if (hours > 0) {
        translationArray.push(`${hours}hr`);
      }
      if (mins > 0) {
        translationArray.push(`${mins}m`);
      };
      const translation = translationArray.join(' ');
      options.push({ amount, translation });
      if (hours < 1) {
        amount += 5;
      } else if (hours < 3) {
        amount += 15;
      } else {
        amount += 60;
      }
    }

    return options;

  }


}
