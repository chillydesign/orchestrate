import { Task } from './task.model';

export class Project {


    public id: number;
    public name: string;
    public status: string;
    public created_at: string;
    public updated_at: string;
    public tasks: Task[];
    public random_tasks: Task[];
    public tasks_count: { complete: number, incomplete: number, total: number };
    public percentage = 0;

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
            this.percentage = (num / den * 100);
        }

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
            }

            this.setPercentage();


        }

    }

}
