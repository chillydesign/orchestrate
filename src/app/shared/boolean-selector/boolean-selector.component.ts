import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-boolean-selector',
  templateUrl: './boolean-selector.component.html',
  styleUrls: ['./boolean-selector.component.scss']
})
export class BooleanSelectorComponent implements OnInit, OnDestroy {
  @Input() value: BehaviorSubject<boolean>;
  @Input() simple_value: boolean;
  @Input() small = false;
  @Input() green = false;
  @Output() booleanChanged = new EventEmitter<boolean>();
  public actual_value: boolean;
  private val_sub: Subscription;

  constructor() { }

  ngOnInit() {

    if (this.simple_value) {
      this.actual_value = this.simple_value;
    }

    if (this.value) {
      this.val_sub = this.value.subscribe(
        (val: boolean) => {
          if (val === true || val === false) {
            this.actual_value = val;
          }

        }
      );
    }

  }

  switchToggle(): void {

    this.actual_value = !this.actual_value;
    this.booleanChanged.next(this.actual_value);

  }

  ngOnDestroy() {
    if (this.val_sub) {
      this.val_sub.unsubscribe();
    }
    if (this.booleanChanged) {
      this.booleanChanged.unsubscribe();
    }
  }

}
