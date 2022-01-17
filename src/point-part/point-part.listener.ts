import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/sequelize';

import { Account } from 'src/account/account.entity';
import { ClassStudent } from 'src/entities/class-student.entity';
import { NotificationService } from 'src/notification/notification.service';
import { DoneEvent } from './point-part.event/mark-grade-done.event';

@Injectable()
export class PointPartListener {
  constructor(
    @InjectModel(ClassStudent)
    private classStudentModel: typeof ClassStudent,
    private readonly notificationService: NotificationService
  ) {}

  @OnEvent('point-part.done', { async: true })
  async HandleGradeDoneEvent({ classId, message, topic }: DoneEvent): Promise<void> {
    const students = await this.classStudentModel.findAll({
      include: [
        {
          model: Account,
          attributes: ['id']
        }
      ],
      where: {
        classId
      }
    });

    const notifications = [];
    students.forEach((student) => {
      student.accountId && notifications.push({ classId, accountId: student.account.id, message, topic });
    });
    await this.notificationService.InsertNotifications(notifications);
  }
}
