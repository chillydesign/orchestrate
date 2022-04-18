// import { Project } from "./project.model";


export class Client {


    public id: number;
    public name: string;
    public slug: string;
    public projects: any[]; //Project[];

    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);

            // dont do this circular dependency
            // if (obj.projects) {
            //     this.projects = obj.projects.map((project: Project) => new Project(project));
            // }

        }
    }

}
