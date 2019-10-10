
export class Task {


    public id: number;
    public project_id: number;
    public content: string;
    public created_at: string;
    public updated_at: string;
    public completed: boolean;
    public ordering: number;
    public indentation = 0;
    public indentation_class: string;

    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);
            this.indentation_class = `indentation_${this.indentation}`;
        }

    }

}
