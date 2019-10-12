
export class Task {


    public id: number;
    public project_id: number;
    public content: string;
    public created_at: string;
    public updated_at: string;
    public completed: boolean;
    public ordering: number;
    public priority = 0;
    public indentation = 0;
    public indentation_class: string;
    public priority_class: string;

    is_url(): boolean {

        const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(this.content);

    }

    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);
            this.indentation_class = `indentation_${this.indentation}`;
            this.priority_class = `priority_${this.priority}`;
        }

    }

}
