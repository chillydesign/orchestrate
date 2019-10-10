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
    const options = this.authService.setAPIOptions();
    const data = {
      attributes: {
        content: task.content,
        project_id: task.project_id,
      }

    };
    const endpoint = `${this.api_url}/?route=tasks`;
    return this.http.post<Task>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Task(res))
    );
  }



  updateTask(task: Task): Observable<Task> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=tasks&id=${task.id}`;
    const data = {
      attributes: {
        content: task.content,
        completed: task.completed,
        ordering: task.ordering,
        indentation: task.indentation,
      }

    };
    return this.http.patch<Task>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Task(res))
    );
  }



  deleteTask(task: Task): Observable<Task> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=tasks&id=${task.id}`;
    return this.http.delete<Task>(endpoint, options).pipe(
      catchError(this.authService.handleError)
      // ,
      // tap(() => console.log('deleted task'))
    );
  }


}
