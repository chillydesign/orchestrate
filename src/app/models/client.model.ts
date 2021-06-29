

export class Client {


    public id: number;
    public name: string;

    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);
        }
    }

}
