import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtExtractorFromCookies } from '../../common/utils/jwtExtractorFromCookies';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../jwt/jwt.payload';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      // jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractorFromCookies]),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.usersService.findUserById(payload.sub);
      if (user) {
        return user;
      } else {
        throw new Error('해당하는 유저는 없습니다.');
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
