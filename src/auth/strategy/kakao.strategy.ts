import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-kakao';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      clientID: process.env.KAKAO_KEY,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }
  async validate(profile: any, done: any): Promise<any> {
    const email = profile._json.kakao_account.email;
    const nickname = profile._json.properties.nickname;
    const user = await this.authService.validateUser(email);
    // 유저가 없을때
    if (user === null) {
      console.log('일회용 토큰 발급');
      const jwt = this.authService.createLoginToken(email);
      const newUser = await this.userRepository.save({
        email: email,
        nickname: nickname,
      });
      done(null, newUser);
      return { jwt, nickname, type: 'once' };
    }

    // 유저가 있을때
    console.log('로그인 토큰 발급');
    const jwt = await this.authService.createLoginToken(user);
    return { jwt, nickname, type: 'login' };
  }
}
