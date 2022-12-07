import { PassportModule } from '@nestjs/passport';
import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
// import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UserModule),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      secretOrPrivateKey: process.env.SECRET_KEY,
    }),
    CacheModule.register({ ttl: 600, max: 1000 }),
  ],
  providers: [AuthService, JwtStrategy, KakaoStrategy],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
