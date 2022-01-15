import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from 'src/account/account.entity';
import { ClassService } from 'src/class/class.service';

import { NotificationService } from 'src/notification/notification.service';
import { PointPart } from 'src/point-part/point-part.entity';
import { Review } from './review.entity';
import { NewCommentEvent, NewReviewEvent, ReviewDoneEvent } from './review.event';

@Injectable()
export class ReviewListener {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectModel(Review)
    private reviewModel: typeof Review,
    private readonly classService: ClassService
  ) {}

  @OnEvent('new-comment.review', { async: true })
  async HandleNewCommentEvent({ topic, accountId, reviewId }: NewCommentEvent): Promise<void> {
    const review = await this.reviewModel.findOne({
      include: [{ model: PointPart }, { model: Account, attributes: ['name', 'studentId', 'id'] }],
      where: { id: reviewId }
    });

    if (review.requester.id === accountId) {
      const target = await this.classService.GetTeachersOfClass(review.grade.classId);

      const message = `Học viên ${review.requester.name} - ${review.requester.studentId} vừa bình luận yêu cầu phúc khảo cột điểm "${review.grade.name}"`;

      const notifications = target.teachers.map((teacher) => ({
        classId: review.grade.classId,
        message,
        accountId: teacher.id,
        topic
      }));

      notifications.push({
        classId: review.grade.classId,
        message,
        accountId: target.ownerId,
        topic
      });

      await this.notificationService.InsertNotifications(notifications);
    } else {
      const notifications = [
        {
          message: `Giảng viên vừa bình luận yêu cầu phúc khảo cột điểm "${review.grade.name}" của bạn`,
          topic,
          accountId: review.requester.id,
          classId: review.grade.classId
        }
      ];
      await this.notificationService.InsertNotifications(notifications);
    }
  }

  @OnEvent('new.review', { async: true })
  async HandleNewReviewEvent({ topic, reviewId }: NewReviewEvent): Promise<void> {
    const review = await this.reviewModel.findOne({
      where: { id: reviewId },
      include: [{ model: PointPart }, { model: Account, attributes: ['studentId', 'name'] }]
    });

    const target = await this.classService.GetTeachersOfClass(review.grade.classId);
    const message = `Học viên ${review.requester.name} - ${review.requester.studentId} vừa yêu cầu phúc khảo cột điểm "${review.grade.name}"`;
    const notifications = target.teachers.map((teacher) => ({
      message,
      topic,
      accountId: teacher.id,
      classId: review.grade.classId
    }));

    notifications.push({
      message,
      topic,
      accountId: target.ownerId,
      classId: review.grade.classId
    });
    await this.notificationService.InsertNotifications(notifications);
  }

  @OnEvent('done.review', { async: true })
  async HandleReviewDoneEvent({ topic, classId, accountId, message }: ReviewDoneEvent): Promise<void> {
    const notifications = [
      {
        message,
        topic,
        accountId,
        classId
      }
    ];
    await this.notificationService.InsertNotifications(notifications);
  }
}
