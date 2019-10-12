export class Upload {

    public id: number;
    public project_id: number;
    public created_at: string;
    public updated_at: string;
    public filename: string;
    public file_contents: string;

    public url: string;

    constructor(obj?: any) {
        if (obj) {
            Object.assign(this, obj);
        }
    }

}
