import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { RequestUser } from 'src/decorators/models/request-user.model';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { User } from '../decorators/user.decorator';
import { CardService } from './card.service';
import { CardCreateDTO } from './models/card-create.dto';

@Controller('card')
export class CardController {

    constructor(private readonly cardService: CardService) {}

    @Get()
    getAll() {
        return this.cardService.cardsList;
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.cardService.getById(id);
    }

    @Get('user/:user_id')
    getManyByOwner(@Param('user_id') userId: string) {
        return this.cardService.getManyByOwner(userId);
    }

    @Post('create')
    postCreate(@Body() cardCreateDTO: CardCreateDTO) {
        return this.cardService.create(cardCreateDTO);
    }

    @UseGuards(JwtAuthGuard)
    @Post('claim-unowned/:id')
    getClaimUnowned(@User() user: RequestUser, @Param('id') cardId: string) {
        return this.cardService.claimUnownedCard(user.id, cardId)
    }
}
