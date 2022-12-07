import { Injectable } from '@nestjs/common';
import { Comment } from '../entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
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
      order: { updatedAt: 'DESC' },
    });
  }

  // 유저별 댓글 조회
  findByUser(userId: number) {
    return this.commentRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  // 댓글 생성
  async create(
    concertId: number,
    userId: number,
    nickname: string,
    profileImg: string,
    createCommentDto: CreateCommentDto,
  ): Promise<void> {
    const { comment } = createCommentDto;
    await this.commentRepository.save({
      concertId,
      userId,
      nickname,
      profileImg,
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
      return await this.commentRepository.save(existComment);
    } else {
      return { errorMessage: '작성자가 아닙니다.' };
    }
  }

  // 댓글 삭제
  async remove(commentId: number, userId: number): Promise<object> {
    const deleteComment = await this.commentRepository.findOne({
      where: { commentId },
    });
    console.log(deleteComment);
    if (deleteComment.userId === userId) {
      await this.commentRepository.delete(deleteComment);
    } else {
      return { errorMessage: '작성자가 아닙니다.' };
    }
  }
}
