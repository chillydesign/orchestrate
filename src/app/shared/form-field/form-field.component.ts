import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent implements OnInit, OnDestroy {
  @Input() errors: Subject<object>;
  @Input() field = 'error';  // show generic errors if no specific one given
  @Input() highlighted = false;
  public field_errors?: string;
  private generic_error = `Please fill in all the mandatory fields.`;
  private forbidden_error = `Action not authorised.`;
  private errorsSubscription: Subscription;
  constructor() { }

  ngOnInit() {

    if (this.errors) {
      this.errorsSubscription = this.errors.subscribe(
        (errors: any) => {
          this.field_errors = undefined;
          if (errors) {
            if (this.field === 'error') {
              if (errors.error && errors.error === 'forbidden') {
                this.field_errors = this.forbidden_error;
              } else {
                this.field_errors = this.generic_error;
              }

            } else {
              const field_errors = errors[this.field];
              if (field_errors) {
                if (typeof field_errors === 'string') {
                  this.field_errors = field_errors;
                } else {
                  this.field_errors = field_errors.join(' ');
                }
              }
            }

          }
        }
      );
    }

  }


  ngOnDestroy(): void {
    if (this.errorsSubscription) {
      this.errorsSubscription.unsubscribe();
    }
  }

}
