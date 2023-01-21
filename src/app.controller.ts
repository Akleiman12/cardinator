import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './decorators/user.decorator';
import { JwtAuthGuard } from './user/guards/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  getPing(): string {
    return 'pong';
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth-ping')
  getAuthPing(@User() user: any): any {
    return { res: 'pong', user: user.id }
  }
}
