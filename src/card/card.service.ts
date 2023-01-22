import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { dataKeeperConfig } from '../../config/data-keeper.config';
import { DataKeeperService, DataTypesEnum } from '../data-keeper/data-keeper.service';
import { CardCreateDTO } from './models/card-create.dto';
import { Card } from './models/card.model';

@Injectable()
export class CardService {

    cardsList: Card[] = [];

    constructor(private readonly dataKeeper: DataKeeperService) {
        this.init();
    }

    private init() {
        this.cardsList = this.dataKeeper.getData(DataTypesEnum.Card);

        // Interval set to backup data locally every 5 mins (300000ms)
        setInterval(() => {
            this.dataKeeper.setData(DataTypesEnum.Card, this.cardsList);
        }, dataKeeperConfig.saveInterval);
    }

    getById(id: string) {
        const card = this.cardsList.find((card) => card.id === id);
        if (!card) throw new NotFoundException('Card not found.');
        return card;
    }

    getManyByOwner(ownerId: string) {
        return this.cardsList.filter((card) => card.owner === ownerId);
    }

    claimUnownedCard(userId: string, cardId: string) {
        // Get card and check it has no owner
        const cardToBuy = this.getById(cardId);
        if (cardToBuy.owner) throw new BadRequestException('Card is already owned.');

        // Set user as owner and return success
        cardToBuy.owner = userId;

        return cardToBuy;
    }

    create(cardCreateDTO: CardCreateDTO) {
        const newCard = Card.create(cardCreateDTO);
        this.cardsList.push(newCard);

        return newCard;
    }

    clearData() {
        this.cardsList = [];
        this.dataKeeper.setData(DataTypesEnum.Card, this.cardsList);
    }
}
