import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserLoginDTO } from './models/user-login.dto';
import { UserRegisterDTO } from './models/user-register.dto';
import { User } from './models/user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get(':id')
    getById(@Param('id') id: string): Partial<User> {
        return this.userService.getById(id);
    }

    @Post('register')
    postRegister(@Body() userRegisterDTO: UserRegisterDTO) {
      return this.userService.register(userRegisterDTO);
    }
  
    @Post('login')
    postLogin(@Body() userLoginDTO: UserLoginDTO): { access_token: string } {
      const access_token = this.userService.login(userLoginDTO);
      return { access_token };
    }
}
