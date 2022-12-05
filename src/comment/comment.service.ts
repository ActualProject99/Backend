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
    return this.commentRepository.find({ where: { concertId } });
  }

  // 유저별 댓글 조회
  findByUser(userId: number) {
    return this.commentRepository.find({ where: { userId } });
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
async update(commentId, userId, updateCommentDto) {
  const existComment = await this.commentRepository.findOne({
    where: { userId, commentId },
  });
  if (existComment) {
    await this.commentRepository
      .createQueryBuilder()
      .update(Comment)
      .set({
        comment: updateCommentDto.comment,
      })
      .where('commentId = :commentId', { commentId })
      .execute();
  } else {
    return { errorMessage: "작성자가 아닙니다." }
  }
}

  // 댓글 삭제
  async remove(commentId: number): Promise<void> {
    await this.commentRepository.delete(commentId);
  }
}
