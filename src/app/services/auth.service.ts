import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import jwt_decode, { JwtPayload } from 'jwt-decode';

interface EmailOpts {
  email: string;
  password: string;
  remember_me?: boolean;
  two_factor_code?: string;
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public is_admin = false;
  public current_user: BehaviorSubject<User | null> = new BehaviorSubject(null);
  private api_url = environment.api_url;
  private token?: string;
  public logged_in = false;
  constructor(private http: HttpClient, private router: Router) {
    this.setCurrentUser();
  }



  signInWithJWT(jwt: string): void {
    this.saveTokenAsCookie(jwt);
    this.setCurrentUser();
    this.logged_in = true;
  }



  // from an email and password get a token to use with the server
  login(opts: EmailOpts): Observable<any> {
    const options = this.setAPIOptions();
    const endpoint = `${this.api_url}/?route=user_token`;
    return this.http.post<{ response: string, jwt: string }>(endpoint, opts, options).pipe(
      catchError(this.handleError)

    );
  }


  logout(): void {
    // clear token remove admin from cookie to log admin out
    this.token = undefined;
    this.removeCookie(environment.cookie_name);
    this.current_user.next(null);
    this.logged_in = false;
    // go back to the homepage
    this.router.navigate(['/']);
  }


  setCurrentUser(): void {
    if (typeof this.token !== 'string') {
      this.setTokenFromCookie();
    }

    if (typeof this.token === 'string') {
      this.getUserFromToken().subscribe(
        (user: User) => {
          if (user) {
            this.logged_in = true;
            this.current_user.next(user);
            this.tokenTimeRemaining();

          }
        },
        (error) => console.log('error', (error))
      );
    }

  }


  getUserFromToken(): Observable<User> {
    const options = this.setAPIOptions();
    const endpoint = `${this.api_url}/?route=users&id=me`;
    return this.http.get<User>(endpoint, options).pipe(
      catchError(this.handleError),
      map(res => new User(res))
    );

  }



  saveTokenAsCookie(token: string): void {
    this.token = token;
    const cookie_length = environment.cookie_length_hours;
    this.setCookie(environment.cookie_name, token, cookie_length);

  }

  tokenTimeRemaining(): void {
    if (typeof jwt_decode !== 'undefined') {
      if (this.token) {
        const decoded: JwtPayload = jwt_decode(this.token);
        if (decoded) {
          const now = new Date().valueOf() / 1000;
          // seconds left before they are logged out
          const timeleft = Math.max(1, decoded.exp - now);
          // settimeout has maximum value of milliseconds before it breaks
          if ((timeleft * 1000) < 86400000) {
            setTimeout(() => {
              alert('You have been logged out now. Stuff probably wasnt saved.')
            }, timeleft * 1000);
          }
          // console.log(decoded, decoded.exp, now, decoded.exp - now);
        }
      }
    }
  }

  setTokenFromCookie(): void {
    this.token = this.getCookie(environment.cookie_name);
  }


  setCookie(name: string, value: string, hours: number): void {
    let expires = '';
    if (hours) {
      const date = new Date();
      date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
      expires = `; expires=` + date.toUTCString();
    }

    let sec_cookie = '';
    if (environment.secure_cookie) {
      sec_cookie = `Secure;SameSite=Strict`;
    }

    environment.cookie_domains.forEach(cookie_domain => {
      document.cookie = `${name}=${(value || '')}${expires};domain=${cookie_domain};path=/;${sec_cookie}`;
    });
  }



  getCookie(name: string): string | undefined {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');

    for (let c of ca) {
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return undefined;
  }


  removeCookie(name: string): void {
    this.setCookie(name, '', -10000);
  }



  setAPIOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json;',
        'Content-Type': 'application/json',
      })
    };
    if (this.token) {
      httpOptions.headers = httpOptions.headers.append('Authorization', `Bearer ${this.token}`)
    }
    return httpOptions;
  }






  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(error.error);
  }




}
