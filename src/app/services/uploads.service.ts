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



}
