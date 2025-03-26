import { Component } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent {
  public status: string = 'stopped';
  public time_elapsed = 0;
  public time_elapsed_nice: string;
  // public start_time: number;
  // public end_time: number;
  public timInt: any;
  startTimer(): void {
    // this.start_time = Date.now();
    this.time_elapsed = 0;
    this.calculateElapsed();
    this.startCounting();

  }

  startCounting(): void {
    this.status = 'started';

    this.timInt = setInterval(() => {
      this.time_elapsed++;
      this.calculateElapsed();
    }, 1000);

  }

  stopTimer(): void {
    this.status = 'stopped';
    // this.start_time = null;
    this.time_elapsed = 0;
    this.calculateElapsed();

    this.clearTimer();

  }

  minutesElapsed(): number {
    return Math.floor(this.time_elapsed / 60);
  }
  secondsElapsed(): number {
    return (this.time_elapsed % 60);
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


    if (this.time_elapsed > 60) {
      this.time_elapsed_nice = `${this.minutesElapsed()}m`;
    } else {
      this.time_elapsed_nice = `${this.secondsElapsed()}s`;
    }


  }



}
