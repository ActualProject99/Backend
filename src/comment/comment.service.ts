import { MinLength } from 'class-validator';
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
import * as dayjs from 'dayjs';

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
    return this.commentRepository.find({
      where: { concertId },
      order: { createdAt: 'DESC' },
    });
  }

  // 유저별 댓글 조회
  findByUser(userId: number) {
    return this.commentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // 댓글 생성
  async create(
    concertId: number,
    userId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<void> {
    const { comment } = createCommentDto;
    await this.commentRepository.save({
      concertId,
      userId,
      ...createCommentDto,
      createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss.sssZ'),
      updatedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss.sssZ'),
    });
  }

  // 댓글 수정
  async updateComment(commentId: number, userId, updateCommentDto) {
    const existComment = await this.commentRepository.findOne({
      where: { commentId, userId },
    });
    const { comment } = updateCommentDto;
    existComment.comment = comment;
    existComment.updatedAt = dayjs().format('YYYY-MM-DDTHH:mm:ss.sssZ');
    if (existComment.userId === userId) {
      if (comment) {
        return await this.commentRepository.save(existComment);
      }
    } else {
      return { errorMessage: '작성자가 아닙니다.' };
    }
  }

  // 댓글 삭제
  async remove(commentId: number): Promise<void> {
    await this.commentRepository.delete(commentId);
  }
}
