import { Task } from './task.model';

export class Commentt {


    public id: number;
    public message: string;
    public author: string;
    public created_at: string;
    public updated_at: string;
    public created_at_date: Date;

    public task: Task;
    public task_id: number;






    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);
            this.created_at_date = new Date(this.created_at);


        }

    }

}
