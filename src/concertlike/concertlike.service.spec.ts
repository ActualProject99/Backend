import { Test, TestingModule } from '@nestjs/testing';
import { ConcertlikeService } from './concertlike.service';

describe('ConcertlikeService', () => {
  let service: ConcertlikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConcertlikeService],
    }).compile();

    service = module.get<ConcertlikeService>(ConcertlikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
