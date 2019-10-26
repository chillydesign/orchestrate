import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private api_url = environment.api_url;

  constructor(private http: HttpClient, private authService: AuthService) { }


  getProjects(opts = { limit: 10, offset: 0, status: 'active' }): Observable<Project[]> {


    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=projects&offset=${opts.offset}&limit=${opts.limit}&status=${opts.status}`;

    return this.http.get<Project[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((p: Project) => new Project(p)))
    );

  }

  getProject(project_id: number): Observable<Project> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=projects&id=${project_id}`;
    return this.http.get<Project>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Project(res))
    );
  }

  addProject(project: Project): Observable<Project> {
    const options = this.authService.setAPIOptions();
    const data = {
      attributes: {
        name: project.name
      }

    };
    const endpoint = `${this.api_url}/?route=projects`;
    return this.http.post<Project>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Project(res))
    );
  }


  updateProject(project: Project): Observable<Project> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=projects&id=${project.id}`;
    const data = {
      attributes: {
        name: project.name,
        status: project.status,
      }

    };
    return this.http.patch<Project>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Project(res))
    );
  }


  deleteProject(project: Project): Observable<Project> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=projects&id=${project.id}`;
    return this.http.delete<Project>(endpoint, options).pipe(
      catchError(this.authService.handleError)
      // ,
      // tap(() => console.log('deleted project'))
    );
  }


}
