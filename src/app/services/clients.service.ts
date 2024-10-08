import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Client } from '../models/client.model';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private api_url = environment.api_url;
  constructor(private http: HttpClient, private authService: AuthService) { }


  getClients(): Observable<Client[]> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=clients`;
    return this.http.get<Client[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((p: Client) => new Client(p)))
    );
  }

  getClient(client_id: number): Observable<Client> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=clients&id=${client_id}`;
    return this.http.get<Client>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Client(res))
    );
  }

  getClientFromSlug(slug: string): Observable<Client> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=clients&slug=${slug}`;
    return this.http.get<Client>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Client(res))
    );
  }




  addClient(client: Client): Observable<Client> {
    const options = this.authService.setAPIOptions();
    const data = {
      attributes: {
        name: client.name,
        slug: client.slug,
      }
    };
    const endpoint = `${this.api_url}/?route=clients`;
    return this.http.post<Client>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Client(res))
    );
  }



  updateClient(client: Client): Observable<Client> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=clients&id=${client.id}`;
    const data = {
      attributes: {
        name: client.name,
        slug: client.slug,
      }

    };
    return this.http.patch<Client>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Client(res))
    );
  }



  deleteClient(client: Client): Observable<Client> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=clients&id=${client.id}`;
    return this.http.delete<Client>(endpoint, options).pipe(
      catchError(this.authService.handleError)
    );
  }





  getStats(client_id: number): Observable<{ month: string, data: number }[]> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=stats&id=${client_id}`;
    return this.http.get<{ month: string, data: number }[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
    );
  }

}
