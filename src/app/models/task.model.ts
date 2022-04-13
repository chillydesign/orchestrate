import { Upload } from './upload.model';
import { User } from './user.model';

export class Task {


    public id: number;
    public project_id: number;
    public content: string;
    public translation: string;
    public created_at: string;
    public updated_at: string;
    public completed: boolean;
    public ordering: number;
    public priority = 0;
    public indentation = 0;
    public created_at_date: Date;
    public completed_at: string;
    public completed_at_date: Date;
    public comments_count: number;
    public time_taken: number = 0;
    public is_title: boolean;
    public is_current: boolean;
    public is_approved: boolean;
    public is_public: boolean;
    public assignee_id: number;
    public assignee: User;
    public uploads_count: number;

    public uploads: Upload[];

    is_url(): boolean {

        const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(this.content);

    }




    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);
            this.created_at_date = new Date(this.created_at);

            if (this.completed_at) {
                this.completed_at_date = new Date(this.completed_at);
            }
            if (obj.assignee) {
                this.assignee = new User(obj.assignee);
            }
        }

    }

}
