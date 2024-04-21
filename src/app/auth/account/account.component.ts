import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  public current_user: User;
  public two_factor_code: string;
  public action: string;
  public qr_code: string;
  public errors: Subject<object> = new Subject();
  private current_user_subscription: Subscription;
  private get_sub: Subscription;
  private remove_sub: Subscription;
  private add_sub: Subscription;
  constructor(private authService: AuthService) { }



  ngOnInit() {
    this.getCurrentUser();

  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        this.current_user = user;

      }
    );
  }

  setAction(action: string) {
    this.action = action;

    if (this.action === 'add2fa') {
      this.getQRCode();
    }
  }



  getQRCode(): void {
    this.get_sub = this.authService.get2faSecret().subscribe(
      {
        next: (response) => {
          if (response.qr_code) {
            this.qr_code = response.qr_code;
          }
        }
      }
    );
  }


  onSubmit(): void {
    if (this.two_factor_code) {

      if (this.action === 'add2fa') {
        this.add2fa();
      } else if (this.action === 'remove2fa') {
        this.remove2fa();
      }

    }
  }


  add2fa(): void {
    this.add_sub = this.authService.confirm2faSecret(this.two_factor_code).subscribe({
      next: response => {
        if (response.verified) {
          this.current_user = response.user;
          this.action = null;
          this.qr_code = null;
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  remove2fa(): void {
    this.remove_sub = this.authService.remove2faSecret(this.two_factor_code).subscribe(
      {
        next: (response) => {
          if (response.removed_2fa) {
            this.current_user = response.user;
            this.action = null;
            this.qr_code = null;
          }
        }
      }
    );
  }


  ngOnDestroy() {
    const subs: Subscription[] = [
      this.current_user_subscription,
      this.get_sub,
      this.remove_sub,
      this.add_sub,


    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }


}
