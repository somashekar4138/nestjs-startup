// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { promisify } from 'util';
import * as jwksRsa from 'jwks-rsa';
import { Jwt as jwtType } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private jwksClient: jwksRsa.JwksClient;

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (
        request: any,
        rawJwtToken: string,
        done: any,
      ) => {
        let decodedToken: jwtType;
        try {
          decodedToken = jwt.decode(rawJwtToken, { complete: true });
          if (!decodedToken || !decodedToken.header.kid) {
            throw new UnauthorizedException('Invalid token');
          }

          const key = await this.getSigningKey(decodedToken.header.kid);
          done(null, key);
        } catch (error) {
          done(error, null);
        }
      },
    });

    this.jwksClient = jwksRsa({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${this.configService.get('AUTH0_DOMAIN')}/.well-known/jwks.json`,
    });
  }

  private async getSigningKey(kid: string): Promise<string> {
    const getSigningKey = promisify(this.jwksClient.getSigningKey);
    const key = await getSigningKey(kid);
    return key.getPublicKey();
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }
    return { userId: payload.sub, id: payload.sub.split('|')[1] }; // or any other properties you want to attach
  }
}
