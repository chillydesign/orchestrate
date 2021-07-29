import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-site-navigation',
  templateUrl: './site-navigation.component.html',
  styleUrls: ['./site-navigation.component.scss']
})
export class SiteNavigationComponent implements OnInit, OnDestroy {
  public current_user: User;
  public site_name = environment.site_name;
  public home_page_url: string[] = ['/'];
  public sidebarVisible = false;
  private router_events_subscription: Subscription;
  private current_user_subscription: Subscription;
  constructor(
    private router: Router,
    private projectsService: ProjectsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.hideSidebarOnPageChange();
    this.getCurrentUser();

    this.projectsService.current_project_client.subscribe(
      (client) => {
        if (client) {
          this.site_name = client.name;
          this.home_page_url = ['/clients', client.slug];
        } else {
          this.site_name = environment.site_name;
          this.home_page_url = ['/'];
        }
      });
  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }


  hideSidebarOnPageChange(): void {
    /// check if page changes, use this to hide sidebar on page chage
    this.router_events_subscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationStart)
    ).subscribe(
      () => this.sidebarVisible = false
    );
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  ngOnDestroy() {

    const subs: Subscription[] = [
      this.current_user_subscription,
      this.router_events_subscription,
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }


}
