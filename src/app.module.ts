import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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

//entities
import { Category } from './entities/category.entity';
import { Concert } from './entities/concert.entity';
import { ConcertLike } from './entities/concert_like.entity';
import { Comment } from './entities/comment.entity';
import { Artist } from './entities/artist.entity';
import { ArtistLike } from './entities/artist_like.entity';
import { User } from "./entities/user.entity"
import { AppService } from './app.service';
import { AppController } from './app.controller';

// import { access } from 'fs';

@Module({
  imports: [
     ConfigModule.forRoot({
       isGlobal: true
     }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Category, Concert, ConcertLike, Comment, Artist, ArtistLike, User],
      synchronize: false, // 매번 연결할때마다 데이터베이스를 날리고 새로 생성하는 메소드
      autoLoadEntities: true, // Entity를 자동으로 로딩
      logging: true, // 로그 기록
      keepConnectionAlive: true, // 계속 실행되도록
    }),
    
      // MySqlConfigModule,
      // MySqlConfigService,
      ArtistModule,
      ArtistlikeModule,
      CommentModule,
      ConcertModule,
      ConcertlikeModule,
      UserModule
    
  ],
    controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
