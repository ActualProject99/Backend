import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistlikeModule } from 'src/artist_like/artist_like.module';
import { ArtistlikeService } from 'src/artist_like/artist_like.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { KakaoStrategy } from 'src/auth/strategy/kakao.strategy';
import { AwsService } from 'src/aws.service';
import { ArtistLike } from 'src/entities/artist_like.entity';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
  ],
  providers: [UserService, AwsService, AuthModule],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
