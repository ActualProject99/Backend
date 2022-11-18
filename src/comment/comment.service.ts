import { Injectable } from '@nestjs/common';
import { Comment } from '../entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

// pagination 설정
  async paginate(options: IPaginationOptions): Promise<Pagination<Comment>> {
    const queryBuilder = this.commentRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.createdAt', 'DESC');

    return paginate<Comment>(queryBuilder, options);
  }

  // 콘서트별 댓글 조회
  async findAll(concertId: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { concertId } });
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
