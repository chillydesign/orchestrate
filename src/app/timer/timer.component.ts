import { Component } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent {
  public status: string = 'stopped';
  public time_elapsed = 0;
  // public start_time: number;
  // public end_time: number;
  public timInt: any;
  startTimer(): void {
    // this.start_time = Date.now();
    this.time_elapsed = 0;
    this.startCounting();

  }

  startCounting(): void {
    this.status = 'started';

    this.timInt = setInterval(() => {
      this.calculateElapsed();
    }, 1000);

    console.log(this.timInt);
  }

  stopTimer(): void {
    this.status = 'stopped';
    // this.start_time = null;
    this.time_elapsed = 0;
    this.clearTimer();

  }

  pauseTimer(): void {
    this.status = 'paused';
    this.clearTimer();
  }

  clearTimer(): void {
    clearInterval(this.timInt);

  }


  toggleTimer(): void {
    if (this.status === 'started') {
      this.pauseTimer();
    } else {
      this.startCounting();

    }
  }

  calculateElapsed(): void {
    // const now = Date.now();
    // this.time_elapsed = Math.floor((now - this.start_time) / 1000);
    this.time_elapsed++;
  }
}
