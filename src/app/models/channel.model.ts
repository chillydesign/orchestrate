import { Client } from './client.model';
import { Message } from './message.model';
import { Project } from './project.model';
import { Upload } from './upload.model';
import { User } from './user.model';

export class Channel {


    public id: number;
    public project_id: number;
    public project: Project;
    public client: Client;
    public client_id: number;
    public name: string;
    public created_at: string;
    public created_at_date: Date;

    public messages: Message[];




    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);
            this.created_at_date = new Date(this.created_at);

            if (obj.project) {
                this.project = new Project(obj.project);
            }
            if (obj.client) {
                this.client = new Client(obj.client);
            }

            if (obj.messages) {
                this.messages = obj.messages.map((message: Message) => new Message(message));
            }

        }

    }

}
