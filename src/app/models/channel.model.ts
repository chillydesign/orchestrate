import { Upload } from './upload.model';
import { User } from './user.model';

export class Channel {


    public id: number;
    public project_id: number;
    public client_id: number;
    public name: string;
    public created_at: string;
    public created_at_date: Date;






    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);
            this.created_at_date = new Date(this.created_at);

        }

    }

}
