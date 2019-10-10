export class Resource {
    
    id: string;
    name: string;
    iconUrl: string;
 
    gatherAction: string; // Action that's required to get the resource

    private icon: HTMLImageElement;

    constructor(init?: Partial<Resource>) {
        Object.assign(this, init);

        this.icon = new Image(24, 24);
        this.icon.src = './img/' + this.iconUrl;
    }

    getIcon() {
        return this.icon;
    }
}