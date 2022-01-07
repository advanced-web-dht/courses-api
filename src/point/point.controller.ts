import { Body, Controller, Post, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { PointService } from './point.service';
import { Point_checkDto } from './point.dto/point_check.dto';

// @UseGuards(AuthGuard('jwt'))
@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}
  @Post('/addfromfile')
  //@Roles(Role.owner, Role.teacher)
  async AddPointFromFile(@Res() res: FastifyReply, @Body() body: Point_checkDto): Promise<void> {
    try {
      const result = await this.pointService.addPointFromFile(body);
      res.status(201).send({ isSuccess: true });
    } catch (err) {
      if (err.parent.errno === 1062) {
        res.status(409).send({ isSuccess: false });
      } else {
        res.status(500).send({ isSuccess: false });
      }
    }
  }
  @Post()
  //@Roles(Role.owner, Role.teacher)
  async AddPoint(@Res() res: FastifyReply, @Body() body): Promise<void> {
    try {
      const result = await this.pointService.addPoint(body);
      res.status(201).send({ isSuccess: true });
    } catch (err) {
      if (err.parent.errno === 1062) {
        res.status(409).send({ isSuccess: false });
      } else {
        res.status(500).send({ isSuccess: false });
      }
    }
  }
}
