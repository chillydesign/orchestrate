import { Channel } from "./channel.model";
import { Upload } from "./upload.model";

export class Message {


    public id: number;
    public user_id: number;
    public channel_id: number;
    public channel: Channel;
    public content: string;
    public created_at: string;
    public created_at_date: Date;
    public uploads: Upload;





    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);
            this.created_at_date = new Date(this.created_at);

            if (obj.channel) {
                this.channel = new Channel(obj.channel);
            }
            if (obj.uploads) {
                this.uploads = obj.uploads.map((upload: Upload) => new Upload(upload));
            }
        }

    }

}
