export class Need {

    id: string;
    name: string;
    priority: number;

    fulfillResource: string; // Resource that's required to fulfill the need
    fulfillAction: string; // Action that's required to fulfill the need (using the resource)
}