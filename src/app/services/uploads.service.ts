import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Upload } from '../models/upload.model';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {

  private api_url = environment.api_url;
  constructor(private http: HttpClient, private authService: AuthService) { }


  getUploads(project_id: number): Observable<Upload[]> {

    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=uploads&project_id=${project_id}`;
    return this.http.get<Upload[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((u: Upload) => new Upload(u)))
    );

  }



  addUpload(upload: Upload): Observable<Upload> {
    const options = this.authService.setAPIOptions();
    const data = {
      attributes: {
        file_contents: upload.file_contents,
        filename: upload.filename,
        project_id: upload.project_id,
      }

    };
    const endpoint = `${this.api_url}/?route=uploads`;
    return this.http.post<Upload>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Upload(res))
    );
  }



  updateUpload(upload: Upload): Observable<Upload> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=uploads&id=${upload.id}`;
    const data = {
      attributes: {
        task_id: upload.task_id,
      }

    };
    return this.http.patch<Upload>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Upload(res))
    );
  }


  deleteUpload(upload: Upload): Observable<Upload> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=uploads&id=${upload.id}`;
    return this.http.delete<Upload>(endpoint, options).pipe(
      catchError(this.authService.handleError)
      // ,
      // tap(() => console.log('deleted upload'))
    );
  }


}
