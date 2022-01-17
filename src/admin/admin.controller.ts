import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';

import { AdminService } from './admin.service';
import { CreateAdminDto } from './admin.dto/create-admin.dto';

@UseGuards(AuthGuard('admin-jwt'))
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async AddNewAdmin(@Res() res: FastifyReply, @Req() req: FastifyRequest, @Body() body: CreateAdminDto): Promise<void> {
    try {
      const { id } = req.user;
      const result = await this.adminService.CreateAdminAccount(body, id);

      if (result) {
        res.status(201).send({ isSuccess: true });
      } else {
        res.status(400).send({ isSuccess: false });
      }
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @Get()
  async GetAllAdmins(@Res() res: FastifyReply, @Query('sort') sort: string, @Query('search') search: string): Promise<void> {
    try {
      const result = await this.adminService.GetAllAdmin(sort, search);

      res.status(200).send(result);
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }

  @Get('/:id')
  async GetAdmin(@Res() res: FastifyReply, @Param('id') id: number): Promise<void> {
    try {
      const result = await this.adminService.GetAdminById(id);

      res.status(200).send(result);
    } catch {
      res.status(500).send({ isSuccess: false });
    }
  }
}
