import { v4 } from 'uuid';
import { CardCreateDTO } from './card-create.dto';

export class Card {
    id: string;
    name: string;
    value: string;
    owner?: string; // Links card to 'owner' user
    createdAt: Date | string;

    constructor(props: Card) {
        this.id = props.id;
        this.name = props.name;
        this.value = props.value;
        this.createdAt = props.createdAt;
    }

    static create(props: CardCreateDTO) {
        return new Card({
            id: v4(),
            name: props.name,
            value: props.value,
            owner: props.owner ? props.owner : undefined,
            createdAt: new Date(),
        });
    }
}