import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/artist.module';
import { ArtistlikeModule } from './artistlike/artistlike.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { ConcertModule } from './concert/concert.module';
import { ConcertlikeModule } from './concertlike/concertlike.module';
import { Category } from './category/category.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './user/models/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Category, UserEntity],
      synchronize: false, // 매번 연결할때마다 데이터베이스를 날리고 새로 생성하는 메소드
      autoLoadEntities: true, // Entity를 자동으로 로딩
      logging: true, // 로그 기록
      keepConnectionAlive: true, // 계속 실행되도록
    }),
    UserModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
@Module({
  imports: [
    ArtistModule,
    ArtistlikeModule,
    CategoryModule,
    CommentModule,
    ConcertModule,
    ConcertlikeModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
