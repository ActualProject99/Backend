import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// module
import { ArtistModule } from './artist/artist.module';
import { ArtistlikeModule } from './artistlike/artistlike.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { ConcertModule } from './concert/concert.module';
import { ConcertlikeModule } from './concertlike/concertlike.module';
import { TestModule } from './test/test.module';

//entities
import { Category } from './entities/category.entity';
import { Concert } from './entities/concert.entity';
import { ConcertLike } from './entities/concertlike.entity';
import { Comment } from './entities/comment.entity';
import { Artist } from './entities/artist.entity';
import { ArtistLike } from './entities/artistlike.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'actualtest',
      entities: [Category, Concert, ConcertLike, Comment, Artist, ArtistLike],
      synchronize: true,
    }),
    TestModule,
  ],
})
@Module({
  imports: [
    ArtistModule,
    ArtistlikeModule,
    CategoryModule,
    CommentModule,
    ConcertModule,
    ConcertlikeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
