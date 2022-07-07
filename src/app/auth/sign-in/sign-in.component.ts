import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  public email: string;
  public password: string;
  public remember_me = false;
  public errors: Subject<object> = new Subject();
  private current_user_subscription: Subscription;
  private login_sub: Subscription;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

  }

  onSubmit() {

    if (this.email && this.password) {
      this.login_sub = this.authService.login(this.email, this.password, this.remember_me).subscribe(
        () => {
          this.errors.next(null);
          this.router.navigate(['/']);
        },
        () => this.errors.next({ signin: 'La connexion a échoué' })
      );
    }

  }



  ngOnDestroy() {
    const subs: Subscription[] = [
      this.login_sub,
      this.current_user_subscription,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

}
