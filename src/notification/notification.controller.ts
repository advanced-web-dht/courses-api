import { Controller, Get, Param, Patch, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest, FastifyReply } from 'fastify';
import { NotificationService } from './notification.service';

@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async GetMessages(@Req() req: FastifyRequest, @Res() res: FastifyReply): Promise<void> {
    try {
      const { id } = req.user;
      const notifications = await this.notificationService.GetAllMessagesOfAccount(id);
      res.status(200).send(notifications);
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @Patch('/:id')
  async UpdateStatus(@Res() res: FastifyReply, @Param('id') id: number): Promise<void> {
    try {
      await this.notificationService.UpdateStatus(id);
      res.status(200).send({ isSuccess: true });
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }
}
