import { Task } from './task.model';
import { Upload } from './upload.model';

export class User {


    public id: number;
    public email: string;
    public last_log_in: string;
    public user_token: string;


    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);
        }
    }

}
