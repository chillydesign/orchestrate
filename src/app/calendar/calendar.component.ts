import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

interface CalendarWeek {
  m: moment.Moment;
  number: number;
  current: boolean;
  current_day: boolean;
  events: CalendarEvent[];
}

interface CalendarEvent {
  title: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  public weeks: CalendarWeek[][];
  public current_month: moment.Moment;
  public current_month_string: string;

  ngOnInit(): void {
    this.current_month = moment().startOf('month');
    this.setWeeks();
  }

  setWeeks(): void {
    this.current_month_string = this.current_month.format('MMMM YYYY');
    const start_date = this.current_month.clone().startOf('isoWeek');//.add(1, 'day');
    const end_date = this.current_month.clone().endOf('month').endOf('isoWeek');//.add(1, 'day');
    const current_date = start_date.clone();
    let wi = 0;
    this.weeks = [];
    while (current_date.isBefore(end_date)) {
      if (this.weeks[wi] === undefined) {
        this.weeks[wi] = [null, null, null, null, null, null, null];
      }
      const m = current_date.clone();
      const num = m.date();
      const day = (m.day() + 6) % 7; // start week on monday
      const current = m.isSame(this.current_month, 'month');
      const current_day = m.isSame(moment(), 'day');
      const events = [];
      const j = (Math.random() * 5);
      for (let jj = 0; jj < j; jj++) {
        events.push({ title: this.randomWords(Math.random() * 10) })
      }
      this.weeks[wi][day] = { m, current, current_day, number: num, events };
      current_date.add(1, 'day');
      if (day == 6) wi++;
    }
  }


  nextMonth(): void {
    this.current_month = this.current_month.add(1, 'month').startOf('month');
    this.setWeeks();
  }

  prevMonth(): void {
    this.current_month = this.current_month.subtract(1, 'month').startOf('month');
    this.setWeeks();
  }

  randomWords(n: number): string {
    const words = ['lorem', 'dolor', 'sit', 'amet', 'charles'];
    let s = [];
    for (let i = 0; i < n; i++) {
      const w = Math.floor(Math.random() * words.length);
      s.push(words[w])
    }
    return s.join(' ');


  }


}
