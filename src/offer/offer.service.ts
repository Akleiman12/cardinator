import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { dataKeeperConfig } from 'config/data-keeper.config';
import { CardService } from 'src/card/card.service';
import { DataKeeperService, DataTypesEnum } from 'src/data-keeper/data-keeper.service';
import { OfferCreateDTO } from './models/offer-create.dto';
import { Offer } from './models/offer.model';

@Injectable()
export class OfferService {
    offerList: Offer[] = [];

    constructor(
        private readonly dataKeeper: DataKeeperService,
        private readonly cardService: CardService
    ) {
        this.init();
    }

    private init() {
        this.offerList = this.dataKeeper.getData(DataTypesEnum.Offer);

        // Interval set to backup data locally every 5 mins (300000ms)
        setInterval(() => {
            this.dataKeeper.setData(DataTypesEnum.Offer, this.offerList);
        }, dataKeeperConfig.saveInterval);
    }

    getById(id: string) {
        const offer = this.offerList.find((offer) => offer.id === id);
        if (!offer) throw new NotFoundException('Offer not found');
        return offer;
    }

    getManyByToUser(toUser: string) {
        return this.offerList.filter((offer) => offer.toUser === toUser);
    }

    getManyByFromUser(fromUser: string) {
        return this.offerList.filter((offer) => offer.fromUser === fromUser);
    }

    create(offerCreateDTO: OfferCreateDTO) {
        // Check if card exists and if it already has an owner
        const offerCard = this.cardService.getById(offerCreateDTO.card);
        if (!offerCard.owner) throw new BadRequestException('Card is not owned, claim it instead.');

        // Create Offer and save it
        const offer = Offer.create(offerCreateDTO, offerCard.owner);
        this.offerList.push(offer);

        return offer;
    }

}
