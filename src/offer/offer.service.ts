import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { dataKeeperConfig } from 'config/data-keeper.config';
import { CardService } from 'src/card/card.service';
import { DataKeeperService, DataTypesEnum } from 'src/data-keeper/data-keeper.service';
import { RequestUser } from 'src/decorators/models/request-user.model';
import { UserService } from 'src/user/user.service';
import { OfferCreateDTO } from './models/offer-create.dto';
import { Offer, OfferStatus } from './models/offer.model';

@Injectable()
export class OfferService {
    offerList: Offer[] = [];

    constructor(
        private readonly dataKeeper: DataKeeperService,
        private readonly cardService: CardService,
        private readonly userService: UserService
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

        // TODO: Check fromUser balance and throw Error if not enough

        // Create Offer and save it
        const offer = Offer.create(offerCreateDTO, offerCard.owner);
        this.offerList.push(offer);

        return offer;
    }

    accept(user: RequestUser, offerId: string) {
        const offerToAccept = this.validateOfferChange(user.id, offerId);

        // TODO: Change users balance
        const toUser = this.userService.getById(offerToAccept.toUser);
        toUser.balance += offerToAccept.ammount;
        const fromUser = this.userService.getById(offerToAccept.fromUser);
        fromUser.balance -= offerToAccept.ammount;

        // Change 'owner' of Card
        const cardToExchange = this.cardService.getById(offerToAccept.card);
        cardToExchange.owner = fromUser.id;

        offerToAccept.status = OfferStatus.Accepted;

        return offerToAccept;
    }

    reject(user: RequestUser, offerId: string) {
        const offerToReject = this.validateOfferChange(user.id, offerId);
        offerToReject.status = OfferStatus.Rejected;
        return offerToReject;
    }
    
    private validateOfferChange(toUser: string, offerId: string) {
        // Check if Offer exists
        const offerToChange = this.getById(offerId);
        
        // Check if toUser equals 'userId' (RequestUser)
        if (offerToChange.toUser !== toUser) throw new BadRequestException('RequestUser is not related to Offer.');
        
        // Check if status is 'Pending'
        if (offerToChange.status !== OfferStatus.Pending) throw new BadRequestException('Offer status is not \'Pending\'.');

        return offerToChange;
    }

}
