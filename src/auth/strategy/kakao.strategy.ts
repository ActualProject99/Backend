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
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const email = profile._json.kakao_account.email;
    const nickname = profile._json.properties.nickname;
    const profileImg = profile._json.properties.image_url;
    // const user_profile = {
    //   email,
    //   nickname,
    //   profileImg,
    // };
    const user = await this.authService.validateUser(email);
    if (user === null) {
      // 유저가 없을때
      // console.log('일회용 토큰 발급');
      // const once_token = this.authService.onceToken(user_profile);
      // return { once_token, type: 'once' };
      const newUser = await this.userRepository.save({
        email: email,
        nickname: nickname,
        profileImg: profileImg,
      });
      done(null, newUser);
    }

    // 유저가 있을때
    console.log('로그인 토큰 발급');
    const access_token = await this.authService.createLoginToken(user);
    const refresh_token = await this.authService.createRefreshToken(user);
    return { access_token, refresh_token, type: 'login' };
  }
}
