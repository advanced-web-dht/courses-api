import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Review } from './review.entity';
import { Comment } from '../entities/comment.entity';
import { Account } from '../account/account.entity';
import { PointPart } from '../point-part/point-part.entity';
import { AddReviewDto } from './review.dto/add-review.dto';
import { ClassStudent } from '../entities/class-student.entity';
import { NewCommentEvent, NewReviewEvent, ReviewDoneEvent } from './review.event';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review)
    private reviewModel: typeof Review,
    @InjectModel(Comment)
    private commentModel: typeof Comment,
    private eventEmitter: EventEmitter2
  ) {}

  async GetReviewOfGradeOfAccount(accountId: number, pointPartId: number): Promise<Review> {
    const result = this.reviewModel.findOne({
      include: [
        {
          model: Comment,
          include: [
            {
              model: Account,
              attributes: ['id', 'email', 'name', 'studentId']
            }
          ]
        },
        {
          model: PointPart
        }
      ],
      where: {
        pointPartId,
        accountId
      }
    });
    return result;
  }

  async AddNewReview(data: AddReviewDto, accountId: number): Promise<Review> {
    const newReview = {
      ...data,
      accountId
    };
    const result = await this.reviewModel.create(newReview);

    const newReviewEvent: NewReviewEvent = {
      reviewId: result.id,
      topic: 'Phúc khảo'
    };
    this.eventEmitter.emit('new.review', newReviewEvent);

    return result;
  }

  async AddNewComment(reviewId: number, accountId: number, message: string): Promise<Comment> {
    const newComment = {
      reviewId,
      accountId,
      message
    };
    const result = await this.commentModel.create(newComment);

    const newCommentEvent: NewCommentEvent = {
      reviewId: reviewId,
      topic: 'Phúc khảo',
      accountId
    };
    this.eventEmitter.emit('new-comment.review', newCommentEvent);

    return result;
  }

  async GetReviewsOfClass(classId: number): Promise<Review[]> {
    const result = this.reviewModel.findAll({
      include: [
        {
          model: PointPart,
          where: { classId },
          attributes: ['id', 'classId', 'name']
        },
        {
          model: Account,
          attributes: ['id', 'email', 'name', 'studentId']
        }
      ],
      attributes: { exclude: ['updatedAt'] }
    });
    return result;
  }

  async GetReviewById(id: number, studentId: string): Promise<Review> {
    const result = this.reviewModel.findOne({
      include: [
        {
          model: PointPart,
          attributes: ['id', 'classId', 'name'],
          include: [{ model: ClassStudent, where: { studentId }, through: { attributes: [] } }]
        },
        {
          model: Account,
          attributes: ['id', 'email', 'name', 'studentId']
        },
        {
          model: Comment,
          include: [
            {
              model: Account,
              attributes: ['id', 'email', 'name', 'studentId']
            }
          ]
        }
      ],
      where: { id },
      attributes: { exclude: ['updatedAt'] }
    });
    return result;
  }

  async UpdateReviewStatus(reviewId: number, finalPoint: number): Promise<void> {
    const review = await this.reviewModel.findOne({
      include: [{ model: Account, attributes: ['studentId', 'name', 'id'] }, { model: PointPart }],
      where: {
        id: reviewId
      }
    });
    review.set('isDone', true);
    review.set('finalPoint', finalPoint);
    await review.save();
    const newCommentEvent: ReviewDoneEvent = {
      topic: 'Phúc khảo',
      accountId: review.requester.id,
      message: `Yêu cầu phúc khảo cột điểm "${review.grade.name}" đã được giải quyết`,
      classId: review.grade.classId
    };
    this.eventEmitter.emit('done.review', newCommentEvent);
  }
}
