import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api_url = environment.api_url;
  public is_admin = false;
  constructor(private http: HttpClient, private router: Router) { }


  setAPIOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json;',
        'Content-Type': 'application/json',

      })
    };
    return httpOptions;
  }

  public toggleAsAdmin(): void {
    this.is_admin = !this.is_admin;
    if (this.is_admin) {
      localStorage.setItem('orch_is_admin', '1');
    } else {
      localStorage.removeItem('orch_is_admin');
    }
  }

  public checkIsAdmin(): void {
    const oia = localStorage.getItem('orch_is_admin');
    if (oia === '1') {
      this.is_admin = true;
    } else {
      this.is_admin = false;
    }
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
    return throwError(
      'Something bad happened; please try again later.');
  }




}
