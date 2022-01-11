import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './review.entity';
import { Comment } from '../entities/comment.entity';
import { Account } from '../account/account.entity';
import { PointPart } from '../point-part/point-part.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review)
    private reviewModel: typeof Review
  ) {}

  async GetReviewOfGradeOfAccount(accountId: number, pointPartId: number): Promise<Review> {
    const result = this.reviewModel.findOne({
      include: [
        {
          model: Comment,
          include: [
            {
              model: Account
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
}
