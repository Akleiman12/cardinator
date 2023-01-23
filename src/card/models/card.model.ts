import { v4 } from 'uuid';
import { CardCreateDTO } from './card-create.dto';

export class Card {
    id: string;
    name: string;
    value: string;
    price: number;
    owner?: string; // Links card to 'owner' user
    createdAt: Date | string;

    constructor(props: Card) {
        this.id = props.id;
        this.name = props.name;
        this.value = props.value;
        this.price = props.price;
        this.owner = props.owner;
        this.createdAt = props.createdAt;
    }

    static create(props: CardCreateDTO) {
        return new Card({
            id: v4(),
            name: props.name,
            value: props.value,
            price: props.price ? props.price : 0,
            owner: props.owner ? props.owner : undefined,
            createdAt: new Date(),
        });
    }
}