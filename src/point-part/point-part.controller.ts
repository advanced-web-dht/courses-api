import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards, Delete, Patch } from '@nestjs/common';
import { PointPartService } from './point-part.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../role/role.enum';
import { PointPart_checkDto } from './point-part.dto/point-part_check.dto';
import { AccountService } from '../account/account.service';
import { RolesGuard } from '../role/roles.guard';
import { UpdatePointPartDTO } from './point-part.dto/update-pointpart.dto';
import { UpdateOrderDto } from './point-part.dto/update-order.dto';

@Controller('pointpart')
export class PointPartController {
  constructor(private readonly pointpartService: PointPartService, private readonly accountServices: AccountService) {}

  @UseGuards(RolesGuard([Role.owner, Role.teacher]))
  @Post('/add')
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/:classID')
  async GetPointStructure(@Res() res: FastifyReply, @Param('classID') id: string): Promise<void> {
    const result = await this.pointpartService.getPointStructure(id);
    res.status(200).send({ result });
  }

  @UseGuards(RolesGuard([Role.owner, Role.teacher]))
  @Put('/:id')
  async updatePointPart(@Res() res: FastifyReply, @Body() body: UpdatePointPartDTO, @Param('id') id: number): Promise<void> {
    try {
      await this.pointpartService.UpdatePointPart(body, id);
      res.status(201).send({ isSuccess: true });
    } catch (err) {
      if (err.parent.errno === 1062) {
        res.status(409).send({ isSuccess: false });
      } else {
        res.status(500).send({ isSuccess: false });
      }
    }
  }

  @UseGuards(RolesGuard([Role.owner, Role.teacher]))
  @Put('/order')
  async updateOrder(@Res() res: FastifyReply, @Body() body: UpdateOrderDto): Promise<void> {
    try {
      await this.pointpartService.UpdateOrder(body.order);
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

  // @Get('allpoint/:classId')
  // async GetAllPointStudent(@Res() res: FastifyReply, @Param() param): Promise<void> {
  //   const result = await this.pointpartService.GetAllWithListStudent(param.classId);
  //   res.status(200).send(result);
  // }

  @UseGuards(RolesGuard([Role.owner, Role.teacher]))
  @Patch('/:id/done')
  async MarkGradeDone(@Res() res: FastifyReply, @Param('id') id: number): Promise<void> {
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

  @UseGuards(RolesGuard([Role.owner, Role.teacher]))
  @Patch('/:id/pending')
  async MarkGradePending(@Res() res: FastifyReply, @Param('id') id: number): Promise<void> {
    try {
      await this.pointpartService.UpdateStatus(id, false);
      res.status(201).send({ isSuccess: true });
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:gradeId/points')
  async GetPointOfPointPart(@Res() res: FastifyReply, @Param('gradeId') gradeId: number): Promise<void> {
    try {
      const result = await this.pointpartService.GetAllPoints(gradeId);
      res.status(200).send(result);
    } catch {
      res.status(500).send({ isSuccess: false, message: 'Internal server error' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/student/class/:classId')
  async GetAllPointOfStudent(@Res() res: FastifyReply, @Req() req: FastifyRequest, @Param('classId') classId: number): Promise<void> {
    try {
      if (!req.user.studentId) {
        const account = await this.accountServices.getAccountById(req.user.id);
        req.user.studentId = account.studentId;
      }
      const result = await this.pointpartService.GetAllPointsOfStudentOfClass(req.user.studentId, classId);
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/class/:classId/done')
  async GetDoneGrades(@Res() res: FastifyReply, @Req() req: FastifyRequest, @Param('classId') classId: number): Promise<void> {
    try {
      const { id } = req.user;
      const result = await this.pointpartService.GetDoneGradeOfClass(classId, id);
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ isSuccess: false });
    }
  }

  @UseGuards(RolesGuard([Role.owner, Role.teacher]))
  @Delete('/:id/class/:classId')
  async DeleteGrade(@Res() res: FastifyReply, @Req() req: FastifyRequest, @Param('id') id: number): Promise<void> {
    try {
      await this.pointpartService.DeletePointPart(id);
      res.status(204).send({ isSuccess: true });
    } catch (err) {
      res.status(500).send({ isSuccess: false });
    }
  }
}
