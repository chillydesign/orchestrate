import { environment } from '../../environments/environment';

export class Upload {

    public id: number;
    public project_id: number;
    public task_id: number;
    public created_at: string;
    public updated_at: string;
    public filename: string;
    public file_contents: string;

    public url: string;
    public full_url: string;
    public nice_created_at: string;

    public setNiceDates(): void {
        if (this.created_at) {
            this.nice_created_at = this.created_at.split(' ')[0];
        }
    }

    constructor(obj?: any) {
        if (obj) {
            Object.assign(this, obj);
            this.full_url = environment.api_url + obj.url;
            this.setNiceDates();
        }
    }

}
