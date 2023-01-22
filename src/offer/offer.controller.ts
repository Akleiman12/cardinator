import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { RequestUser } from 'src/decorators/models/request-user.model';
import { User } from 'src/decorators/user.decorator';
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

    @Get('user/:to_user')
    getByToUser(@Param('to_user') toUser: string) {
        return this.offerService.getManyByToUser(toUser);
    }

    @Get('user/:from_user')
    getByFromUser(@Param('from_user') fromUser: string) {
        return this.offerService.getManyByFromUser(fromUser);
    }

    @Post('create')
    create(@Body() offerCreateDTO: OfferCreateDTO) {
        return this.offerService.create(offerCreateDTO);
    }

    @Post('accept/:id')
    postAccept(@User() user: RequestUser, @Param('id') id: string) {
        return this.offerService.accept(user, id);
    }

    @Post('reject/:id')
    postReject(@User() user: RequestUser, @Param('id') id: string) {
        return this.offerService.reject(user, id);
    }
}
