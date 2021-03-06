
import { Task } from './task.model';
import { Upload } from './upload.model';

export class Project {


    public id: number;
    public name: string;
    public status: string;
    public created_at: string;
    public updated_at: string;
    public tasks: Task[];
    public random_tasks: Task[];
    public uploads: Upload[];
    public tasks_count: { complete: number, incomplete: number, total: number };
    public total_minutes; number;
    public percentage = 0;
    public client_id: number;
    public client: any;
    public move_incomplete_to_project_id: number;

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
        if (this.tasks) {
            this.tasks_count = {
                complete: this.tasks.filter(t => t.completed).length,
                incomplete: this.tasks.filter(t => t.completed === false).length,
                total: this.tasks.length,
            };
        }
        this.setPercentage();
    }

    public setPercentage(): void {
        if (this.tasks_count) {
            const num = this.tasks_count.complete;
            const den = Math.max(this.tasks_count.total, 1);
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
    }




    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);

            if (obj.random_tasks) {
                this.random_tasks = obj.random_tasks.map((task: Task) => new Task(task));
            }

            if (obj.tasks) {
                this.tasks = obj.tasks.map((task: Task) => new Task(task));
                this.setTasksCount();
                this.setTotalMinutes();
            }
            if (obj.uploads) {
                this.uploads = obj.uploads.map((upload: Upload) => new Upload(upload));
            }




            this.setPercentage();




        }

    }

}
