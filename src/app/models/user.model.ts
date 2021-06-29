import { Task } from './task.model';
import { Upload } from './upload.model';

export class User {


    public id: number;
    public email: string;
    public last_log_in: string;
    public user_token: string;
    public role: string;
    public is_admin: boolean;




    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);

            this.is_admin = (this.role === 'admin');

        }
    }

}
