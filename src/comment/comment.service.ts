import { Injectable } from '@nestjs/common';
import { Comment } from '../entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  // 콘서트별 댓글 조회
  async findAll(concertId: number) {
    await this.commentRepository.find({ where: { concertId } });
    await this.commentRepository.findAndCount({
      order: {
        updatedAt: 'DESC',
      },
      skip: 0,
      take: 10,
    });
  }

  // 댓글 생성
  async create(
    { concertId },
    createCommentDto: CreateCommentDto,
  ): Promise<void> {
    const { comment } = createCommentDto;
    await this.commentRepository.save({ concertId, ...createCommentDto });
  }

  // 댓글 삭제
  async remove(commentId: number): Promise<void> {
    await this.commentRepository.delete(commentId);
  }
}
