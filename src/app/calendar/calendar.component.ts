import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Task } from '../models/task.model';
import { TasksService } from '../services/tasks.service';
import { Subscription } from 'rxjs';

interface CalendarWeek {
  m: moment.Moment;
  number: number;
  date: string;
  current: boolean;
  current_day: boolean;
  tasks: Task[];
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
  public start_date: string;
  public end_date: string;
  public tasks: Task[];
  private tasks_sub: Subscription;

  constructor(private tasksService: TasksService) { }

  ngOnInit(): void {
    this.current_month = moment().startOf('month');
    this.setWeeks();
  }

  setWeeks(): void {
    this.current_month_string = this.current_month.format('MMMM YYYY');
    const start_date = this.current_month.clone().startOf('isoWeek');
    const end_date = this.current_month.clone().endOf('month').endOf('isoWeek');
    const current_date = start_date.clone();

    this.start_date = start_date.format('YYYY-MM-DD');
    this.end_date = end_date.format('YYYY-MM-DD');

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
      const date = current_date.format('YYYY-MM-DD');
      // const events = [];
      // const j = (Math.random() * 5);
      // for (let jj = 0; jj < j; jj++) {
      //   events.push({ title: this.randomWords(Math.random() * 10) })
      // }
      this.weeks[wi][day] = { m, date, current, current_day, number: num, tasks: [] };
      current_date.add(1, 'day');
      if (day == 6) wi++;
    }
    this.getTasks();
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


  getTasks(): void {
    this.tasks_sub = this.tasksService.getTasks({ start_date: this.start_date, end_date: this.end_date }).subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
      },
      complete: () => {
        this.addTasksToDates();
      }
    });
  }

  addTasksToDates(): void {
    if (this.tasks) {
      this.weeks.forEach(week => {
        week.forEach(day => {
          day.tasks = this.tasks.filter(t => {
            return (t.completed && moment(t.completed_at).isSame(day.m, 'day')) ||
              (!t.completed && moment(t.created_at).isSame(day.m, 'day'))
          });
        });
      })

    }
  }

  ngOnDestroy() {

    const subs: Subscription[] = [
      this.tasks_sub,
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }


}
