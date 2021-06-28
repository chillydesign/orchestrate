import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Comment } from '../models/comment.model';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private api_url = environment.api_url;

  constructor(private http: HttpClient, private authService: AuthService) { }




  getComments(task_id: number): Observable<Comment[]> {


    const options = this.authService.setAPIOptionsNoLogin();
    const endpoint = `${this.api_url}/?route=comments&task_id=${task_id}`;

    return this.http.get<Comment[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((p: Comment) => new Comment(p)))
    );

  }



  addComment(comment: Comment): Observable<Comment> {
    const options = this.authService.setAPIOptionsNoLogin();
    const data = {
      attributes: {
        author: comment.author,
        message: comment.message,
        task_id: comment.task_id,
      }
    };
    const endpoint = `${this.api_url}/?route=comments`;
    return this.http.post<Comment>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Comment(res))
    );
  }



  updateComment(comment: Comment): Observable<Comment> {
    const options = this.authService.setAPIOptionsNoLogin();
    const endpoint = `${this.api_url}/?route=comments&id=${comment.id}`;
    const data = {
      attributes: {
        message: comment.message,
      }

    };
    return this.http.patch<Comment>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Comment(res))
    );
  }



  deleteComment(comment: Comment): Observable<Comment> {
    const options = this.authService.setAPIOptionsNoLogin();
    const endpoint = `${this.api_url}/?route=comments&id=${comment.id}`;
    return this.http.delete<Comment>(endpoint, options).pipe(
      catchError(this.authService.handleError)
      // ,
      // tap(() => console.log('deleted comment'))
    );
  }

}
