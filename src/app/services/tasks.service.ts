import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Task } from '../models/task.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Upload } from '../models/upload.model';

export interface TasksOptions {
  client_id?: number;
  limit?: number;
  search_term?: string;
  order?: string;
  completed?: number;
}


@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private api_url = environment.api_url;
  public close_task_menu: BehaviorSubject<number | null> = new BehaviorSubject(null);
  constructor(private http: HttpClient, private authService: AuthService) { }



  getTasks(opts: TasksOptions): Observable<Task[]> {
    const options = this.authService.setAPIOptions();
    let endpoint = `${this.api_url}/?route=tasks`;

    if (opts) {
      if (opts.client_id) {
        endpoint = endpoint.concat(`&client_id=${opts.client_id}`);
      }
      if (opts.search_term) {
        endpoint = endpoint.concat(`&search_term=${opts.search_term}`);
      }
      if (opts.limit) {
        endpoint = endpoint.concat(`&limit=${opts.limit}`);
      }
      if (opts.order) {
        endpoint = endpoint.concat(`&order=${opts.order}`);
      }
      if (opts.completed === 0 || opts.completed === 1) {
        endpoint = endpoint.concat(`&completed=${opts.completed}`);
      }
    }
    return this.http.get<Task[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((p: Task) => new Task(p)))
    );
  }


  addTask(task: Task): Observable<Task> {
    const options = this.authService.setAPIOptions();
    const data = {
      attributes: {
        content: task.content,
        translation: task.translation,
        project_id: task.project_id,
        ordering: task.ordering,
        time_taken: task.time_taken,
        is_public: task.is_public,
        task_code: task.task_code,
      }
    };
    const endpoint = `${this.api_url}/?route=tasks`;
    return this.http.post<Task>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Task(res))
    );
  }



  updateTask(task: Task): Observable<Task> {
    const options = this.authService.setAPIOptions()
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
        is_public: task.is_public,
        is_approved: task.is_approved,
        assignee_id: task.assignee_id,
        updated_at: task.updated_at,
        task_code: task.task_code,
      }

    };
    return this.http.patch<Task>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Task(res))
    );
  }


  updateTaskField(task: Task, field: string): Observable<Task> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=tasks&id=${task.id}&single_field=true`;

    const data = { attributes: { updated_at: task.updated_at, field: field, data: task[field] } };

    // const data = {
    //   attributes: {
    //     content: task.content,
    //     completed: task.completed,
    //     translation: task.translation,
    //     ordering: task.ordering,
    //     indentation: task.indentation,
    //     priority: task.priority,
    //     completed_at: task.completed_at,
    //     time_taken: task.time_taken,
    //     is_title: task.is_title,
    //     is_current: task.is_current,
    //     is_public: task.is_public,
    //     is_approved: task.is_approved,
    //     assignee_id: task.assignee_id,
    //   }

    // };
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


  getMonthlyStats(start_date: string): Observable<Task[]> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=monthly_stats&start_date=${start_date}`;
    return this.http.get<Task[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),

    );
  }




  getCurrentTasks(): Observable<Task[]> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=tasks&is_current=true`;
    return this.http.get<Task[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((p: Task) => new Task(p)))
    );
  }

  getTasksCompletedToday(): Observable<Task[]> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=tasks&completed_today=true`;
    return this.http.get<Task[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((p: Task) => new Task(p)))
    );
  }


  getUploads(task_id: number): Observable<Upload[]> {

    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=uploads&task_id=${task_id}`;
    return this.http.get<Upload[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((u: Upload) => new Upload(u)))
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
