import { Body, Controller, Get, Post, Put, Res, Req, UseGuards, Param, Delete, Patch, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest, FastifyReply } from 'fastify';

import { Account } from './account.entity';
import { UpdateAccountDto } from './account.dto/update-account.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/check-email')
  async checkEmailExisted(@Res() res: FastifyReply, @Body('email') email: string): Promise<void> {
    const result = await this.accountService.checkEmailExisted(email);
    res.status(200).send({ isExisted: result });
  }

  @Post('/check-username')
  async checkUsernameExisted(@Res() res: FastifyReply, @Body('username') username: string): Promise<void> {
    const result = await this.accountService.checkUsernameExisted(username);
    res.status(200).send({ isExisted: result });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateAccount(@Req() req: FastifyRequest, @Body() body: UpdateAccountDto): Promise<Account> {
    const result = await this.accountService.UpdateAccount(req.user.id, body);
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async getProfile(@Res() res: FastifyReply, @Req() req: FastifyRequest): Promise<void> {
    const result = await this.accountService.findUser(req.user.username || req.user.email);
    res.status(200).send({ name: result.name, studentId: result.studentId });
  }

  @UseGuards(AuthGuard('admin-jwt'))
  @Get()
  async GetAccountList(@Res() res: FastifyReply, @Query('sort') sort: string, @Query('search') search: string): Promise<void> {
    try {
      const result = await this.accountService.GetAllAccount(sort, search);
      res.status(200).send(result);
    } catch {
      res.status(200).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('admin-jwt'))
  @Get('/:id')
  async GetAccountDetail(@Res() res: FastifyReply, @Param('id') id: number): Promise<void> {
    try {
      const result = await this.accountService.getAccountById(id);
      res.status(200).send(result);
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('admin-jwt'))
  @Put('/:id/studentId')
  async MapStudentId(@Res() res: FastifyReply, @Param('id') id: number, @Body('studentId') studentId: string): Promise<void> {
    try {
      const result = await this.accountService.UpdateStudentId(id, studentId);
      if (result) {
        res.status(202).send({ isSuccess: true });
      } else {
        res.status(400).send({ isSuccess: false });
      }
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('admin-jwt'))
  @Delete('/:id/studentId')
  async UnmapStudentId(@Res() res: FastifyReply, @Param('id') id: number, @Body('studentId') studentId: string): Promise<void> {
    try {
      const result = await this.accountService.UpdateStudentId(id);
      if (result) {
        res.status(202).send({ isSuccess: true });
      } else {
        res.status(400).send({ isSuccess: false });
      }
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('admin-jwt'))
  @Patch('/:id/blocked')
  async BlockAccount(@Res() res: FastifyReply, @Param('id') id: number): Promise<void> {
    try {
      const result = await this.accountService.UpdateAccountStatus('blocked', null, id);
      if (result) {
        res.status(202).send({ isSuccess: true });
      } else {
        res.status(400).send({ isSuccess: false });
      }
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @UseGuards(AuthGuard('admin-jwt'))
  @Patch('/:id/unblock')
  async UnblockAccount(@Res() res: FastifyReply, @Param('id') id: number): Promise<void> {
    try {
      const result = await this.accountService.UpdateAccountStatus('active', null, id);
      if (result) {
        res.status(202).send({ isSuccess: true });
      } else {
        res.status(400).send({ isSuccess: false });
      }
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }
}
