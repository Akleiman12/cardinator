import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { RequestUser } from '../decorators/models/request-user.model';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../user/guards/jwt.guard';
import { OfferCreateDTO } from './models/offer-create.dto';
import { OfferService } from './offer.service';

@Controller('offer')
export class OfferController {

    constructor(private readonly offerService: OfferService) {}

    @Get()
    getAll() {
        return this.offerService.offerList;
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.offerService.getById(id);
    }


    @Get('to_user/:to_user')
    getByToUser(@Param('to_user') toUser: string) {
        return this.offerService.getManyByToUser(toUser);
    }

    @Get('from_user/:from_user')
    getByFromUser(@Param('from_user') fromUser: string) {
        return this.offerService.getManyByFromUser(fromUser);
    }

    @UseGuards(JwtAuthGuard)
    @Post('claim-unowned/:id')
    getClaimUnowned(@User() user: RequestUser, @Param('id') cardId: string) {
        return this.offerService.buyUnownedCard(user.id, cardId)
    }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    create(@User() user: RequestUser, @Body() offerCreateDTO: OfferCreateDTO) {
        return this.offerService.create(user, offerCreateDTO);
    }

    @UseGuards(JwtAuthGuard)
    @Post('accept/:id')
    postAccept(@User() user: RequestUser, @Param('id') id: string) {
        return this.offerService.accept(user, id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('reject/:id')
    postReject(@User() user: RequestUser, @Param('id') id: string) {
        return this.offerService.reject(user, id);
    }
}
