import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { PointPartService } from './point-part.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/roles.decorator';
import { Role } from '../role/role.enum';
import { PointPart_checkDto } from './point-part.dto/point-part_check.dto';
import { AccountService } from '../account/account.service';

@UseGuards(AuthGuard('jwt'))
@Controller('pointpart')
export class PointPartController {
  constructor(private readonly pointpartService: PointPartService, private readonly accountServices: AccountService) {}

  @Post('/add')
  @Roles(Role.owner, Role.teacher)
  async AddPointPart(@Res() res: FastifyReply, @Body() payload: PointPart_checkDto): Promise<void> {
    try {
      const result = await this.pointpartService.addPointPart(payload);
      res.status(201).send({ isSuccess: true, PointPart: result });
    } catch (err) {
      if (err.parent.errno === 1062) {
        res.status(409).send({ isSuccess: false });
      } else {
        res.status(500).send({ isSuccess: false });
      }
    }
  }

  @Get('/:classID')
  async GetPointStructure(@Res() res: FastifyReply, @Param('classID') id: string): Promise<void> {
    const result = await this.pointpartService.getPointStructure(id);
    res.status(200).send({ result });
  }

  @Put()
  @Roles(Role.owner, Role.teacher)
  async updatePointPart(@Res() res, @Body() req): Promise<void> {
    try {
      await this.pointpartService.UpdatePointPart(req);
      res.status(201).send({ isSuccess: true });
    } catch (err) {
      if (err.parent.errno === 1062) {
        res.status(409).send({ isSuccess: false });
      } else {
        res.status(500).send({ isSuccess: false });
      }
    }
  }

  @Put('/order')
  async updateOrder(@Res() res, @Body() req): Promise<void> {
    try {
      await this.pointpartService.UpdateOrder(req.order);
      res.status(201).send({ isSuccess: true });
    } catch (err) {
      if (err.parent.errno === 1062) {
        res.status(409).send({ isSuccess: false });
      } else {
        res.status(500).send({ isSuccess: false });
      }
    }
  }

  // @Get('/:id/:classId')
  // async GetPointPartStudent(@Res() res: FastifyReply, @Param() param): Promise<void> {
  //   const result = await this.pointpartService.GetPointPartWithListStudent(param.id, param.classId);
  //   res.status(200).send({ result });
  // }

  @Get('allpoint/:classId')
  async GetAllPointStudent(@Res() res: FastifyReply, @Param() param): Promise<void> {
    const result = await this.pointpartService.GetAllWithListStudent(param.classId);
    res.status(200).send(result);
  }

  @Put('/done')
  async MarkGradeDone(@Res() res: FastifyReply, @Body('id') id: number): Promise<void> {
    try {
      await this.pointpartService.UpdateStatus(id, true);
      res.status(201).send({ isSuccess: true });
    } catch (err) {
      if (err.parent.errno === 1062) {
        res.status(409).send({ isSuccess: false });
      } else {
        res.status(500).send({ isSuccess: false });
      }
    }
  }

  @Put('/pending')
  async MarkGradePending(@Res() res: FastifyReply, @Body('id') id: number): Promise<void> {
    try {
      await this.pointpartService.UpdateStatus(id, false);
      res.status(201).send({ isSuccess: true });
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @Get('/:gradeId/points')
  async GetPointOfPointPart(@Res() res: FastifyReply, @Param('gradeId') gradeId: number): Promise<void> {
    try {
      const result = await this.pointpartService.GetAllPoint(gradeId);
      res.status(200).send(result);
    } catch {
      res.status(500).send({ isSuccess: false, message: 'Internal server error' });
    }
  }

  @Get('/student/class/:classId')
  async GetAllPointOfStudent(@Res() res: FastifyReply, @Req() req: FastifyRequest, @Param('classId') classId: number): Promise<void> {
    try {
      if (!req.user.studentId) {
        console.log(req.user);
        const account = await this.accountServices.getAccountById(req.user.id);
        req.user.studentId = account.studentId;
      }
      const result = await this.pointpartService.GetAllPointsOfStudentOfClass(req.user.studentId, classId);
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ isSuccess: false });
    }
  }
}
