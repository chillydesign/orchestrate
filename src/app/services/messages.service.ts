import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Message } from '../models/message.model';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private api_url = environment.api_url;

  constructor(private http: HttpClient, private authService: AuthService) { }




  getMessages(channel_id: number): Observable<Message[]> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=messages&channel_id=${channel_id}`;
    return this.http.get<Message[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((p: Message) => new Message(p)))
    );

  }



  addMessage(message: Message): Observable<Message> {
    const options = this.authService.setAPIOptions();
    const data = {
      attributes: {
        content: message.content,
        channel_id: message.channel_id,
        user_id: message.user_id,
      }
    };
    const endpoint = `${this.api_url}/?route=messages`;
    return this.http.post<Message>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Message(res))
    );
  }



  updateMessage(message: Message): Observable<Message> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=messages&id=${message.id}`;
    const data = {
      attributes: {
        content: message.content,
      }

    };
    return this.http.patch<Message>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Message(res))
    );
  }



  deleteMessage(message: Message): Observable<Message> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=messages&id=${message.id}`;
    return this.http.delete<Message>(endpoint, options).pipe(
      catchError(this.authService.handleError)
      // ,
      // tap(() => console.log('deleted message'))
    );
  }

}
