import { v4 } from 'uuid';
import { OfferCreateDTO } from "./offer-create.dto";

export enum OfferStatus {
    'Pending',
    'Accepted',
    'Rejected'
}

export class Offer {
    id: string;
    fromUser: string; // Links to user generating the offer
    toUser: string; // Links to user receiving the offer
    card: string; // Links to card being requested
    ammount: number;
    status: OfferStatus;
    createdAt: Date;

    constructor(props: Offer) {
        this.id = props.id;
        this.fromUser = props.fromUser;
        this.toUser = props.toUser;
        this.card = props.card;
        this.ammount = props.ammount;
        this.status = props.status;
        this.createdAt = props.createdAt;
    }

    static create(props: OfferCreateDTO, fromUser: string, toUser: string) {
        return new Offer({
            id: v4(),
            fromUser,
            toUser,
            card: props.card,
            ammount: props.ammount,
            status: OfferStatus.Pending,
            createdAt: new Date()
        })
    }
}