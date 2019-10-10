import { Game } from "../Game";
import { Settings } from "../Settings";
import { Need } from "./Need";

export class Human {

    private name: string;
    private icon: HTMLImageElement;

    private needs: Record<string, number>;
    private resources: Record<string, number>;

    // Actions
    private currentAction: string;

    // Health
    private isDead: boolean;

    private game: Game;

    public constructor(game: Game, name: string) {
        this.game = game;
        this.name = name;

        this.icon = new Image(100, 100);
        this.icon.src = './img/person.png';

        this.resources = {
            food: 2,
            wood: 0
        };

        this.needs = {
            energy: 100,
            shelter: 50
        };
    }

    public act() {
        if (this.isDead) {
            return;
        }

        // Chooose action based on current state of action, needs and resources

        // Which of my needs has the highest urgency (consider priority + lack of it)
        let maxUrgency = 0;
        let mostUrgentNeed: Need = null;
        for (var id in this.needs) {
            let need = this.game.getNeed(id);
            let satisfaction = this.needs[id];

            let urgency = (1 - satisfaction / 100) * need.priority;

            if (urgency >= maxUrgency) {
                mostUrgentNeed = need;
                maxUrgency = urgency;
            }
        }

        // Find out if I have the resources to fulfill my most urgent need
        let resAmount = this.resources[mostUrgentNeed.fulfillResource];
        let resource = this.game.getResource(mostUrgentNeed.fulfillResource);
        if (resAmount > 0) {
            // Use resource to fulfill the need
            this[mostUrgentNeed.fulfillAction]();
        }
        else {
            // First, gather resource, that's required to fulfill the need
            this[resource.gatherAction]();
        }

        // Degrade shelter over time
        if (this.needs.shelter > 0) {
            this.needs.shelter -= 1;
        }


        // Check Health State
        if (this.needs.energy <= 0) {
            // I am dead
            this.isDead = true;
            this.currentAction = 'DEAD';
        }
    }

    private idle() {
        // Being idle, requires 1 food
        this.needs.energy -= 1;

        this.currentAction = 'IDLE';
    }

    private eat() {
        // Eating, gain x food
        let amount = Math.min(100 - this.needs.energy, this.resources.food);
        if (amount <= this.resources.food) {
            this.resources.food -= amount;
            this.needs.energy = Math.min(this.needs.energy + amount, 100);
        }

        this.currentAction = 'EATING';
    }

    private hunt() {
        // Hunting, might gain x food, requires 5 energy

        // Determine change of successful hunt
        let success = Math.random() <= Settings.settings.huntingSuccess / 100;

        if (success) {
            // Determine, how much food I have caught
            let foodGain = 5 + Math.floor(Math.random() * Settings.settings.maxHuntingFoodGain);
            this.resources.food += foodGain;
        }

        this.needs.energy -= 5;

        this.currentAction = 'HUNTING';
    }

    private gatherWood() {
        // Gathering wood, gain 5 wood, requires 2 energy

        let woodGain = 10;
        this.resources.wood += woodGain;
        this.needs.energy -= 2;

        this.currentAction = 'GATHER WOOD';
    }

    private build() {
        // Building, gain 5 shelter, requires 5 wood and 5 energy
        
        this.needs.shelter = Math.min(this.needs.shelter + 5, 100);
        this.resources.wood -= 5;
        this.needs.energy -= 5;

        this.currentAction = 'BUILDING';
    }

    public draw(ctx: CanvasRenderingContext2D, x: number, y: number) {

        ctx.font = "12px Arial";

        // Box
        ctx.fillStyle = this.isDead ? '#ff7777' : '#fff';
        ctx.fillRect(x, y, 600, 80);
        ctx.strokeStyle = '#777';
        ctx.strokeRect(x, y, 600, 80);

        // Person
        ctx.drawImage(this.icon, x + 10, y + 10, 50, 50);
        ctx.fillStyle = '#000';
        ctx.fillText(this.name, x + 15, y + 70);

        // Action
        var xpos = 100;
        ctx.fillText('Action', x + xpos, y + 10);
        ctx.fillText(this.currentAction, x + xpos, y + 50);

        // Resources
        xpos = 200;
        ctx.fillText('Resources', x + xpos, y + 10);
        for (var resId in this.resources) {
            let res = this.game.getResource(resId);
            // Icon
            ctx.drawImage(res.getIcon(), x + xpos, y + 40, 24, 24);

            // Value 
            ctx.fillText(this.resources[resId].toString(), x + xpos, y + 70);

            xpos += 40;
        }

        // Needs
        xpos = 400;
        ctx.fillText('Needs', x + xpos, y + 10);
        for (var needId in this.needs) {
            let need = this.game.getNeed(needId);
            let satisfaction = this.needs[needId];

            // Name
            ctx.fillText(need.name, x + xpos, y + 20);

            // Satisfaction Bar
            const barHeight = 36;

            // Color
            let red = Math.max(0, 255 - satisfaction * 3);
            let green = satisfaction * 2;
            ctx.fillStyle = this.rgbToHex(red, green, 0);
            ctx.fillRect(x + xpos, y + 30, 30, barHeight);
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + xpos, y + 30, 30, ((100 - satisfaction) / 100) * barHeight);

            // Satisfaction Text
            ctx.fillStyle = '#000';
            ctx.fillText(satisfaction.toString(), x + xpos, y + 70);

            xpos += 40;
        }
    }

    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
}