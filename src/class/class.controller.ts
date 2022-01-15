import { Controller, Get, Post, Body, Res, UseGuards, Request, Req, Param } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

import { ClassService } from './class.service';
import { Class } from './class.entity';
import { createClassDto } from './class.dto/create-class.dto';
import { MailService } from '../mail/mail.service';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account.entity';

@Controller('classes')
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    private readonly mailService: MailService,
    private readonly accountService: AccountService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async GetAllClasses(@Request() req: FastifyRequest): Promise<Class[]> {
    const result = await this.classService.getAll(req.user.id);
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async AddClass(@Res() res: FastifyReply, @Body() payload: createClassDto, @Request() req: FastifyRequest): Promise<void> {
    try {
      const newClass = await this.classService.CreateClass(payload, req.user);
      res.status(200).send(newClass);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:code/invite')
  async InviteStudent(
    @Res() res: FastifyReply,
    @Param('code') code: string,
    @Body('email') email: string,
    @Body('isTeacher') isTeacher: boolean
  ): Promise<void> {
    try {
      if (isTeacher) {
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '10h' });
        const inviteLink = `${process.env.CLIENT_URL}/enroll/${code}?token=${token}`;

        await this.mailService.sendInvitationMail(email, inviteLink);
        res.status(200).send({ isSuccess: true });
      } else {
        const inviteLink = `${process.env.CLIENT_URL}/enroll/${code}`;
        await this.mailService.sendInvitationMail(email, inviteLink);
        res.status(200).send({ isSuccess: true });
      }
    } catch (e) {
      res.status(500).send({ message: 'Internal server error' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:classId/students')
  async AddStudents(
    @Request() { user }: FastifyRequest,
    @Res() res: FastifyReply,
    @Param('classId') classId: number,
    @Body('studentId') studentId: string
  ): Promise<void> {
    try {
      await this.classService.AddStudent(user.id, classId, studentId, user.name);
      res.status(201).send({ isSuccess: true });
    } catch (e) {
      if (e.parent.errno === 1062) {
        res.status(409).send({ isSuccess: false });
      } else {
        res.status(500).send({ isSuccess: false });
      }
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:classId/list')
  async AddStudentFromList(
    @Res() res: FastifyReply,
    @Body() body: Record<string, string | number>[],
    @Param('classId') classId: number
  ): Promise<void> {
    try {
      this.classService.AddStudentList(body, classId);
      res.status(201).send({ isSuccess: true });
    } catch (e) {
      res.status(500).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:classId/teachers')
  async AddTeacher(
    @Request() { user }: FastifyRequest,
    @Res() res: FastifyReply,
    @Body('token') token: string,
    @Param('classId') classId: number
  ): Promise<void> {
    const check = jwt.verify(token, process.env.SECRET_KEY);
    if ((check && (check as jwt.JwtPayload)).email === user.email) {
      try {
        await this.classService.AddTeacher(user.id, classId);
        res.status(201).send({ isSuccess: true });
      } catch (e) {
        if (e.parent.errno === 1062) {
          res.status(409).send({ isSuccess: false });
        } else {
          res.status(500).send({ isSuccess: false });
        }
      }
    } else {
      res.status(401).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:classId/:role')
  async register(@Param() params: { classId: number; role: string }): Promise<Account[]> {
    return this.classService.getMemberByRole(params.classId, params.role);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:classId/grade-board')
  async GetAllGradeOfClass(@Param('classId') classId: number): Promise<Class> {
    return this.classService.GetAllGrade(classId);
  }

  @Get('/:code/enroll')
  async GetClassToEnroll(@Param('code') code: string): Promise<Class> {
    const result = await this.classService.getClassByCodeToEnroll(code);
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:code')
  async GetClass(@Req() req: FastifyRequest, @Param('code') code: string): Promise<Class> {
    const result = await this.classService.getClassByCode(code, req.user.id);
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/student/:studentId')
  async GetStudentOfClass(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Param('id') id: number,
    @Param('studentId') studentId: string
  ): Promise<void> {
    try {
      const result = await this.classService.GetStudentById(id, studentId);
      res.status(200).send(result);
    } catch (e) {
      res.status(500).send({ isSuccess: false });
    }
  }
}
