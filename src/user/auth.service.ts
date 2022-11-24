import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import CryptoJS from 'crypto-js';
import { User } from 'src/entities/user.entity';
import { getConnection } from 'typeorm';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new Error();
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

    const token = this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: '50m',
    });

    const refresh_token = CryptoJS.AES.encrypt(
      JSON.stringify(token),
      process.env.AES_KEY,
    ).toString();

    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ user_refresh_token: token })
      .where(`userId = ${user.userId}`)
      .execute();
    return refresh_token;
  }

  onceToken(user_profile: any) {
    const payload = {
      user_email: user_profile.user_email,
      user_nick: user_profile.user_nick,
      user_provider: user_profile.user_provider,
      user_token: 'onceToken',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: '10m',
    });
  }

  async tokenValidate(token: string) {
    return await this.jwtService.verify(token, {
      secret: process.env.SECRET_KEY,
    });
  }
}
