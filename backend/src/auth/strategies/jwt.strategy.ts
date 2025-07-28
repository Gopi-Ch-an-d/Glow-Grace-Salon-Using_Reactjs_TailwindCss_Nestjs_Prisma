import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (_req: any, _rawJwtToken: any, done: (err: any, secret?: string | Buffer) => void) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          return done(new Error('JWT_SECRET not defined in environment'));
        }
        done(null, secret);
      },
    });
  }

  async validate(payload: any) {
    if (!payload?.sub || !payload?.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
