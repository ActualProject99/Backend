import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { getConnection } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async createLoginToken(user: User) {
    const payload = {
      userId: user.userId,
      user_token: 'loginToken',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: '6m',
    });
  }

  async createRefreshToken(user: User) {
    const payload = {
      userId: user.userId,
      user_token: 'refreshToken',
    };

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: '50m',
    });

    return refresh_token;

    // const refresh_token = CryptoJS.AES.encrypt(
    //   JSON.stringify(token),
    //   process.env.AES_KEY,
    // ).toString();

    // await getConnection()
    //   .createQueryBuilder()
    //   .update(User)
    //   .set({ refresh_token: token })
    //   .where(`userId = ${user.userId}`)
    //   .execute();
    // return refresh_token;
  }

  onceToken(user_profile: any) {
    const payload = {
      email: user_profile.email,
      nickname: user_profile.nickname,
      profileImg: user_profile.profileImg,
      user_token: 'onceToken',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: '10m',
    });
  }
// 리턴 어디로 하는거죠?
  async tokenValidate(token: string) {
    return await this.jwtService.verify(token, {
      secret: process.env.SECRET_KEY,
    });
  }
}
