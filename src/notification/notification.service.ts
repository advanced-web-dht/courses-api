import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Class } from 'src/class/class.entity';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private notificationModel: typeof Notification
  ) {}

  async GetAllMessagesOfAccount(accountId: number): Promise<Notification[]> {
    const result = await this.notificationModel.findAll({
      where: { accountId },
      include: [{ model: Class }],
      order: [['createdAt', 'DESC']]
    });
    return result;
  }

  async UpdateStatus(id: number): Promise<void> {
    await this.notificationModel.update({ isRead: 1 }, { where: { id } });
  }

  async InsertNotifications(notifications: Array<Record<string, string | number>>): Promise<void> {
    await this.notificationModel.bulkCreate(notifications);
  }
}
