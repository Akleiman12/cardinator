import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConfig } from 'config/jwt.config';

// This class validates the JWT sent via the 'Authentication' header as a Bearer Token.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secretKey,
    });
  }

  // No need to do validations since the 'Strategy' already validated the JWT and returned a valid JSON at this point
  async validate(payload: any) {
    return { 
        id: payload.id,
        username: payload.username,
        wallet: payload.wallet
    };
  }
}