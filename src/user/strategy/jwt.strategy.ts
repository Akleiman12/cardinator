import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConfig } from 'config/jwt.config';
import { UserService } from '../user.service';

// This class validates the JWT sent via the 'Authentication' header as a Bearer Token.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secretKey,
    });
  }

  // No need to do validations since the 'Strategy' already validated the JWT and returned a valid JSON at this point
  async validate(payload: any) {
    const user = this.userService.getById(payload.id);

    return { 
        ...user
    };
  }
}