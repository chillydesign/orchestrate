import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


export interface ProjectsOptions {
  limit?: number;
  offset?: number;
  status?: string;
  client_id?: number;
  current?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private api_url = environment.api_url;

  constructor(private http: HttpClient, private authService: AuthService) { }


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


  getProjectCSV(project_id: number) {
    const data = null;
    const options = this.authService.setAPIOptionsNoLogin();
    const endpoint = `${this.api_url}/?route=projects&id=${project_id}&format=csv`;
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
