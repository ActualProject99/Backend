import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
// import { MySqlConfigModule } from './config/database/config.module';
// import { MySqlConfigService } from './config/database/config.service';

// module
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { ArtistlikeModule } from './artist_like/artist_like.module';
import { CommentModule } from './comment/comment.module';
import { ConcertModule } from './concert/concert.module';
import { ConcertlikeModule } from './concert_like/concert_like.module';
import { ConfigModule } from '@nestjs/config';
import { LocationModule } from './location/location.module';
import { ChatsModule } from './chats/chats.module';

//entities
import { Category } from './entities/category.entity';
import { Concert } from './entities/concert.entity';
import { ConcertLike } from './entities/concert_like.entity';
import { Comment } from './entities/comment.entity';
import { Artist } from './entities/artist.entity';
import { ArtistLike } from './entities/artist_like.entity';
import { User } from './entities/user.entity';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Location } from './entities/location.entity';
import { hotConcert } from './entities/hot_concert.entity';

// import { access } from 'fs';
import { LocationService } from './location/location.service';
import { LocationController } from './location/location.controller';
import { AuthModule } from './auth/auth.module';
import { AlarmModule } from './alarm/alarm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      timezone: 'Asia/Seoul',
      entities: [
        Category,
        Concert,
        ConcertLike,
        Comment,
        Artist,
        ArtistLike,
        User,
        Location,
        hotConcert,
      ],
      synchronize: false, // ?????? ?????????????????? ????????????????????? ????????? ?????? ???????????? ?????????
      autoLoadEntities: true, // Entity??? ???????????? ??????
      logging: true, // ?????? ??????
      keepConnectionAlive: true, // ?????? ???????????????
    }),
    MongooseModule.forRoot(
      `mongodb+srv://admin:tgle1222!@cluster0.ofwavxq.mongodb.net/?retryWrites=true&w=majority`,
    ),

    // MySqlConfigModule,
    // MySqlConfigService,
    ChatsModule,
    LocationModule,
    ArtistModule,
    ArtistlikeModule,
    CommentModule,
    ConcertModule,
    ConcertlikeModule,
    UserModule,
    LocationModule,
    AuthModule,
    AlarmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
