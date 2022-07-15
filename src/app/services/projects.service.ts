import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Project } from '../models/project.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Client } from '../models/client.model';
import { User } from '../models/user.model';

/**
 * Options for Project api
 */
export interface ProjectsOptions {
  limit?: number;
  offset?: number;
  status?: string;
  client_id?: number;
  /** projects a user is currently working on */
  current?: boolean;
  /** include tasks in fetch of projects */
  include_tasks?: boolean;
  assignee?: User;
  search_term?: string;
}

export interface ExportOptions {
  client_id?: number;
  project_id?: number;
  is_approved?: string;
  completed?: string;
  start_date?: string;
  end_date?: string;

}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private api_url = environment.api_url;
  public current_project_client: Subject<Client> = new Subject();
  constructor(private http: HttpClient, private authService: AuthService) {
    this.current_project_client.next(null);
  }


  getProjects(opts?: ProjectsOptions): Observable<Project[]> {


    const options = this.authService.setAPIOptionsNoLogin();
    let endpoint = `${this.api_url}/?route=projects`;

    if (opts) {
      if (opts.limit) {
        endpoint = endpoint.concat(`&limit=${opts.limit}`);
      }
      if (opts.offset) {
        endpoint = endpoint.concat(`&offset=${opts.offset}`);
      }
      if (opts.status) {
        endpoint = endpoint.concat(`&status=${opts.status}`);
      }
      if (opts.client_id) {
        endpoint = endpoint.concat(`&client_id=${opts.client_id}`);
      }
      if (opts.current) {
        endpoint = endpoint.concat(`&current=true`);
      }
      if (opts.include_tasks) {
        endpoint = endpoint.concat(`&include_tasks=true`);
      }
      if (opts.assignee) {
        endpoint = endpoint.concat(`&assignee_id=${opts.assignee.id}`);
      }
      if (opts.search_term && opts.search_term != '') {
        endpoint = endpoint.concat(`&search_term=${opts.search_term}`);
      }
    }


    return this.http.get<Project[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((p: Project) => new Project(p)))
    );

  }

  getProject(project_id: number): Observable<Project> {
    const options = this.authService.setAPIOptionsNoLogin();
    const endpoint = `${this.api_url}/?route=projects&id=${project_id}`;
    return this.http.get<Project>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Project(res))
    );
  }

  getProjectsCSV(opts?: ExportOptions) {
    const options = this.authService.setAPIOptionsNoLogin();
    let endpoint = `${this.api_url}/?route=projects&format=csv`;
    if (opts) {
      if (opts.client_id) {
        endpoint = endpoint.concat(`&client_id=${opts.client_id}`);
      }
      if (opts.project_id) {
        endpoint = endpoint.concat(`&project_id=${opts.project_id}`);
      }
      if (opts.end_date) {
        endpoint = endpoint.concat(`&start_date=${opts.start_date}`);
      }
      if (opts.end_date) {
        endpoint = endpoint.concat(`&start_date=${opts.end_date}`);
      }
      if (opts.is_approved) {
        endpoint = endpoint.concat(`&is_approved=${opts.is_approved}`);
      }
      if (opts.completed) {
        endpoint = endpoint.concat(`&completed=${opts.completed}`);
      }
    }
    return this.http.get<{ csv: string }>(endpoint, options).pipe(
      map((res: { csv: string }) => res.csv)
    );
  }

  addProject(project: Project): Observable<Project> {
    const options = this.authService.setAPIOptionsNoLogin();
    const data = {
      attributes: {
        name: project.name,
        client_id: project.client_id,
        month: project.month,
      }

    };
    const endpoint = `${this.api_url}/?route=projects`;
    return this.http.post<Project>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Project(res))
    );
  }


  updateProject(project: Project): Observable<Project> {
    const options = this.authService.setAPIOptionsNoLogin();
    const endpoint = `${this.api_url}/?route=projects&id=${project.id}`;
    const data = {
      attributes: {
        name: project.name,
        status: project.status,
        client_id: project.client_id,
        move_incomplete_to_project_id: project.move_incomplete_to_project_id,
        month: project.month,
      }

    };
    return this.http.patch<Project>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Project(res))
    );
  }


  deleteProject(project: Project): Observable<Project> {
    const options = this.authService.setAPIOptionsNoLogin();
    const endpoint = `${this.api_url}/?route=projects&id=${project.id}`;
    return this.http.delete<Project>(endpoint, options).pipe(
      catchError(this.authService.handleError)
      // ,
      // tap(() => console.log('deleted project'))
    );
  }


}
