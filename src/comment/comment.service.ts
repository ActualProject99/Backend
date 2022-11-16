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
  findAll(concertId: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { concertId } });
  }
  // 댓글 생성
  async create(createCommentDto: CreateCommentDto): Promise<void> {
    const { comment } = createCommentDto;
    await this.commentRepository.save({ ...createCommentDto });
  }
  // 댓글 삭제
  async remove(commentId: number): Promise<void> {
    await this.commentRepository.delete(commentId);
  }
}
