import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
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
        const card = this.cardService.getById(id);
        if (!card) throw new NotFoundException('Card not found');
        return
    }

    @Get('user/:id')
    getManyByOwner(@Param('id') id: string) {
        return this.cardService.getManyByOwner(id);
    }

    @Post('create')
    postCreate(@Body() cardCreateDTO: CardCreateDTO) {
        return this.cardService.create(cardCreateDTO);
    }

    @UseGuards(JwtAuthGuard)
    @Post('claim-unowned/:id')
    getClaimUnowned(@User() user, @Param('id') cardId: string) {
        return this.cardService.claimUnownedCard(user.id, cardId)
    }
}
