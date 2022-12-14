import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-kakao';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
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
    const profileImg = profile._json.properties.profile_image;
    const user = await this.authService.validateUser(email);
    // 유저가 없을때
    if (!user) {
      console.log('회원정보 저장후 토큰발급');
      const access_token = this.authService.createLoginToken(email);
      const refresh_token = this.userService.makeRefreshToken(email);
      const newUser = await this.userRepository.save({
        email: email,
        nickname: nickname,
        profileImg: profileImg,
        refresh_token: refreshToken,
      });
      await this.userService.CurrnetRefreshToken(refreshToken, user.userId);
      // done(null, newUser);
      return { access_token, refresh_token };
    }

    // 유저가 있을때
    console.log('로그인 토큰 발급');
    const access_token = await this.authService.createLoginToken(user);
    const refresh_token = await this.userService.makeRefreshToken(user);
    await this.userService.CurrnetRefreshToken(refreshToken, user.userId);
    return { access_token, refresh_token, nickname };
  }
}
