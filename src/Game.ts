import { Human } from "./model/Human";
import { Resource } from "./model/Resource";
import { Need } from "./model/Need";
import { Settings } from "./Settings";

export class Game {

    // Time
    private day: number = 0;
    private hour: number = 0;

    // Humans
    private humans: Array<Human>;

    // Resources and Needs
    private resources: Record<string, Resource>;
    private needs: Record<string, Need>;

    // Drawing
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor() {
        this.initialize();
    }

    private initialize() {
        this.resources = {
            'food': new Resource({
                id: 'food',
                name: 'Food',
                iconUrl: 'meat.png',
                gatherAction: 'hunt'
            }),
            'wood': new Resource({
                id: 'wood',
                name: 'Wood',
                iconUrl: 'wood.png',
                gatherAction: 'gatherWood'
            })
        };

        this.needs = {
            'energy': {
                id: 'energy',
                name: 'Energy',
                priority: 4,
                fulfillAction: 'eat',
                fulfillResource: 'food'
            },
            'shelter': {
                id: 'shelter',
                name: 'Shelter',
                priority: 1,
                fulfillAction: 'build',
                fulfillResource: 'wood'
            }
        };
    }

    start() {
        Settings.init();

        this.canvas = <HTMLCanvasElement>document.getElementById('game-canvas');
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');

        // Initialize Base Humans
        const humanCount = 5;
        this.humans = [];
        for (var i = 0; i < humanCount; i++) {
            this.humans.push(new Human(this, 'Human ' + (i + 1)));
        }

        // Start Game Timer
        this.update();
    }   

    update() {

        // World Time
        this.hour++;
        if (this.hour >= 24) {
            this.hour = 0;
            this.day++;
        }

        // Update humans
        this.humans.forEach(human => {
            human.act();
        })

        // Redraw Canvas
        this.draw(this.context);

        // Repeat at the given simulation rate
        setTimeout(() => this.update(), 1000 - Settings.settings.simInterval);
    }

    draw(ctx: CanvasRenderingContext2D) {
        
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = '#eee';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Time
        ctx.font = "24px Arial";
        ctx.fillStyle = '#000';
        ctx.fillText(`Day ${this.day + 1}`, 10, 20);
        ctx.fillText(`${this.hour}:00`, 10, 50);
        
        // Humans
        for (var i = 0; i < this.humans.length; i++) {
            this.humans[i].draw(ctx, 10, 100 + i * 90);
        }
    }

    getResource(id: string) {
        return this.resources[id];
    }

    getNeed(id: string) {
        return this.needs[id];
    }

    getHumans() {
        return this.humans;
    }
}