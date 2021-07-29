import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private api_url = environment.api_url;
  constructor(private http: HttpClient, private authService: AuthService) { }


  getUsers(): Observable<User[]> {
    const endpoint = `${this.api_url}/?route=users`;
    const options = this.authService.setAPIOptions();
    return this.http.get<User[]>(endpoint, options).pipe(
      map(res => res.map((p: User) => new User(p)))
    );
  }

}
