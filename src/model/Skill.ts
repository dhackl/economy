export class Skill {

    id: string;
    name: string;
    iconUrl: string;

    private icon: HTMLImageElement;

    constructor(init?: Partial<Skill>) {
        Object.assign(this, init);

        this.icon = new Image(24, 24);
        this.icon.src = './img/' + this.iconUrl;
    }

    getIcon() {
        return this.icon;
    }
}