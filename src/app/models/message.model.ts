import { Channel } from "./channel.model";

export class Message {


    public id: number;
    public user_id: number;
    public channel_id: number;
    public channel: Channel;
    public content: string;
    public created_at: string;
    public created_at_date: Date;






    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);
            this.created_at_date = new Date(this.created_at);

            if (obj.channel) {
                this.channel = new Channel(obj.channel);
            }
        }

    }

}
