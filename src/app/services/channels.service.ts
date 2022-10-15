import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Channel } from '../models/channel.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


export interface ChannelsOptions {
  client_id?: number;
  project_id?: number;
}


@Injectable({
  providedIn: 'root'
})
export class ChannelsService {
  private api_url = environment.api_url;
  public close_channel_menu: BehaviorSubject<number | null> = new BehaviorSubject(null);
  constructor(private http: HttpClient, private authService: AuthService) { }

  addChannel(channel: Channel): Observable<Channel> {
    const options = this.authService.setAPIOptions();
    const data = {
      attributes: {
        name: channel.name
      }
    };
    const endpoint = `${this.api_url}/?route=channels`;
    return this.http.post<Channel>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Channel(res))
    );
  }



  updateChannel(channel: Channel): Observable<Channel> {
    const options = this.authService.setAPIOptions()
    const endpoint = `${this.api_url}/?route=channels&id=${channel.id}`;
    const data = {
      attributes: {
        name: channel.name

      }

    };
    return this.http.patch<Channel>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Channel(res))
    );
  }





  deleteChannel(channel: Channel): Observable<Channel> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=channels&id=${channel.id}`;
    return this.http.delete<Channel>(endpoint, options).pipe(
      catchError(this.authService.handleError)
      // ,
      // tap(() => console.log('deleted channel'))
    );
  }




  getChannels(opts?: ChannelsOptions): Observable<Channel[]> {
    const options = this.authService.setAPIOptions();
    let endpoint = `${this.api_url}/?route=channels`;

    if (opts) {
      if (opts.client_id) {
        endpoint = endpoint.concat(`&client_id=${opts.client_id}`);
      }
      if (opts.project_id) {
        endpoint = endpoint.concat(`&project_id=${opts.project_id}`);
      }
    }
    return this.http.get<Channel[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((p: Channel) => new Channel(p)))
    );
  }




}
