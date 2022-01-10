import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { PointService } from './point.service';
import { AddPointListDto } from './point.dto/add-points.dto';
import { RolesGuard } from '../role/roles.guard';
import { Role } from '../role/role.enum';

@UseGuards(RolesGuard([Role.teacher, Role.owner]))
@Controller('points')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post('/list')
  async AddPointFromFile(@Res() res: FastifyReply, @Body() body: AddPointListDto): Promise<void> {
    try {
      await this.pointService.AddPointList(body);
      res.status(201).send({ isSuccess: true });
    } catch (err) {
      res.status(500).send({ isSuccess: false });
    }
  }

  @Post()
  async AddPoint(@Res() res: FastifyReply, @Body() body): Promise<void> {
    try {
      const result = await this.pointService.AddPoint(body);
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
