import { Controller, Get, UseGuards } from '@nestjs/common';
import { CardService } from './card/card.service';
import { RequestUser } from './decorators/models/request-user.model';
import { User } from './decorators/user.decorator';
import { OfferService } from './offer/offer.service';
import { JwtAuthGuard } from './user/guards/jwt.guard';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly cardService: CardService,
    private readonly offerService: OfferService,
  ) {}

  @Get('ping')
  getPing(): string {
    return 'pong';
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth-ping')
  getAuthPing(@User() user: RequestUser): any {
    return { res: 'pong', user: user.id }
  }

  @Get('clear')
  getClear() {
    this.userService.clearData();
    this.cardService.clearData();
    this.offerService.clearData();
  }
}
