import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Commentt } from '../models/comment.model';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private api_url = environment.api_url;

  constructor(private http: HttpClient, private authService: AuthService) { }




  getComments(task_id: number): Observable<Commentt[]> {


    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=comments&task_id=${task_id}`;

    return this.http.get<Commentt[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((p: Commentt) => new Commentt(p)))
    );

  }



  getComment(comment_id: number): Observable<Commentt> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=comments&id=${comment_id}`;
    return this.http.get<Commentt>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Commentt(res))
    );
  }

  addComment(comment: Commentt): Observable<Commentt> {
    const options = this.authService.setAPIOptions();
    const data = {
      attributes: {
        author: comment.author,
        message: comment.message,
        task_id: comment.task_id,
      }
    };
    const endpoint = `${this.api_url}/?route=comments`;
    return this.http.post<Commentt>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Commentt(res))
    );
  }



  updateComment(comment: Commentt): Observable<Commentt> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=comments&id=${comment.id}`;
    const data = {
      attributes: {
        message: comment.message,
      }

    };
    return this.http.patch<Commentt>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Commentt(res))
    );
  }



  deleteComment(comment: Commentt): Observable<Commentt> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=comments&id=${comment.id}`;
    return this.http.delete<Commentt>(endpoint, options).pipe(
      catchError(this.authService.handleError)
      // ,
      // tap(() => console.log('deleted comment'))
    );
  }

}
