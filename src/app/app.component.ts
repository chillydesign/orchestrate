import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';
import { WindowrefService } from './services/windowref.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = environment.site_name;
  public current_user: User;
  private current_user_subscription: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private authService: AuthService,
    private winRef: WindowrefService,

  ) { }


  ngOnInit() {

    this.setPageTitle();

    this.getCurrentUser();
  }


  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;
        const body = this.winRef.nativeWindow.document.body;
        if (user) {
          if (user.dark_mode) {
            body.classList.add('dark_mode');
          } else {
            body.classList.remove('dark_mode');
          }
        }
      }
    );
  }


  setPageTitle() {

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    ).subscribe(
      (event) => {
        let event_title = this.title;
        if (typeof event.title !== 'undefined') {
          event_title = `${event.title} | ${this.title}`;
        }
        this.titleService.setTitle(event_title);
      }
    );
  }


}
