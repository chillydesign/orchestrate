
import { Client } from './client.model';
import { Task } from './task.model';
import { Upload } from './upload.model';

export class Project {


    public id: number;
    public name: string;
    public status: string;
    public created_at: string;
    public updated_at: string;
    public tasks: Task[];
    public visible_tasks: Task[];
    public random_tasks: Task[];
    public uploads: Upload[];
    public tasks_count_obj: { complete: number, incomplete: number, total: number };
    public tasks_count: number;
    public incomplete_tasks_count: number;
    public total_minutes: number;
    public total_hours: string;
    public percentage = 0;
    public client_id: number;
    public client: any;
    public move_incomplete_to_project_id: number;
    public month: string;
    public nice_month: string;
    public nice_name: string;
    public nice_name_with_client: string;
    public search_string: string;



    public getNextTaskOrdering(): number {
        if (this.tasks) {
            if (this.tasks.length > 0) {
                const orderings: number[] = this.tasks.map(t => t.ordering);
                return Math.min(9999, Math.max(...orderings) + 1);
            }
            return 1;
        }
        return 1;

    }

    public setTasksCount(): void {
        // if (this.tasks) {
        //     this.tasks_count_obj = {
        //         complete: this.tasks.filter(t => t.completed).length,
        //         incomplete: this.tasks.filter(t => t.completed === false).length,
        //         total: this.tasks.length,
        //     };
        // }

        this.incomplete_tasks_count = this.tasks.filter(f => f.completed === false).length;
        this.tasks_count = this.tasks.length;
        this.setPercentage();
    }

    public setPercentage(): void {
        // if (this.tasks_count_obj) {
        //     const num = this.tasks_count_obj.complete;
        //     const den = Math.max(this.tasks_count_obj.total, 1);
        //     this.percentage = Math.round(num / den * 100);
        // }


        if (this.tasks_count == 0 && this.incomplete_tasks_count === 0) {
            this.percentage = 0;
        } else if (this.incomplete_tasks_count === 0) {
            this.percentage = 100;

        } else {
            const num = this.tasks_count - this.incomplete_tasks_count;
            const den = this.tasks_count;
            this.percentage = Math.round(num / den * 100);
        }

    }

    setTotalMinutes(): void {
        let tm = 0;
        this.tasks.forEach(task => {
            if (task.time_taken !== undefined) {
                tm += task.time_taken;
            }
        });
        this.total_minutes = tm;
        if (tm < 60) {
            this.total_hours = `${tm} mins`;
        } else {
            const h = Math.floor(tm / 60);
            const m = tm % 60;
            this.total_hours = `${h} hrs`;
            if (m > 0) {
                this.total_hours = this.total_hours.concat(` ${m} mins`);
            }
        }

    }


    setMonthAndNiceName(): void {
        this.nice_name = this.name;
        if (this.month) {
            const name = this.name;
            const month = new Date(this.month);
            // if date valid
            if (!isNaN(month.getTime())) {
                const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(month);
                const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(month);
                const moo = new Intl.DateTimeFormat('fr', { month: 'long' }).format(month);
                const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(month);
                this.month = `${ye}-${mo}-${da}`;
                this.nice_month = `${moo} ${ye}`;
                this.nice_name = `${this.nice_month} | ${name}`;
            }
        }

        if (this.client) {
            this.nice_name_with_client = `${this.client.name} | ${this.nice_name}`;
        } else {
            this.nice_name_with_client = this.nice_name;
        }

        this.search_string = this.nice_name_with_client.toLowerCase();

    }



    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);

            if (obj.random_tasks) {
                this.random_tasks = obj.random_tasks.map((task: Task) => new Task(task));
            }

            if (obj.tasks) {
                this.tasks = obj.tasks.map((task: Task) => new Task(task));
                this.visible_tasks = this.tasks;
                this.setTasksCount();
                this.setTotalMinutes();
            }
            if (obj.uploads) {
                this.uploads = obj.uploads.map((upload: Upload) => new Upload(upload));
            }
            if (obj.client) {
                this.client = new Client(obj.client);
            }

            this.setMonthAndNiceName();
            this.setPercentage();




        }

    }

}
