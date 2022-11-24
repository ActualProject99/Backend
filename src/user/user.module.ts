import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { KakaoStrategy } from 'src/auth/strategy/kakao.strategy';
import { AwsService } from 'src/aws.service';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    // JwtModule.register({
    //   secret: process.env.SECRET_KEY,
    //   secretOrPrivateKey: process.env.SECRET_KEY,
    //   signOptions: { expiresIn: '1d' },
    // }),
  ],
  providers: [
    JwtStrategy,
    JwtService,
    AuthService,
    UserService,
    AwsService,
    // AuthModule,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
