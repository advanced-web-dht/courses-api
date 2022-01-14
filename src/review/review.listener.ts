import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/sequelize';

import { NotificationService } from 'src/notification/notification.service';
import { PointPart } from 'src/point-part/point-part.entity';
import { Review } from './review.entity';
import { NewCommentEvent } from './review.event';

@Injectable()
export class ReviewListener {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectModel(Review)
    private reviewModel: typeof Review
  ) {}

  @OnEvent('review.new-comment', { async: true })
  async HandleNewCommentEvent({ message, topic, accountId, reviewId }: NewCommentEvent): Promise<void> {
    const review = await this.reviewModel.findOne({ include: [{ model: PointPart }], where: { id: reviewId } });

    const notifications = [
      {
        message,
        topic,
        accountId,
        classId: review.grade.classId
      }
    ];
    await this.notificationService.InsertNotifications(notifications);
  }
}
