import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';

import { Admin } from './admin.entity';
import { CreateAdminDto } from './admin.dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin)
    private readonly adminModel: typeof Admin
  ) {}

  async CreateAdminAccount(payload: CreateAdminDto, creatorId?: number): Promise<boolean> {
    try {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(payload.password, saltOrRounds);

      const newAdmin = {
        ...payload,
        password: hash,
        creatorId
      };
      await this.adminModel.create(newAdmin);
      return true;
    } catch {
      return false;
    }
  }

  async GetAdminById(id: number): Promise<Admin> {
    const admin = await this.adminModel.findOne({
      where: { id },
      include: [{ model: Admin, attributes: ['id', 'name'], as: 'creator' }],
      attributes: { exclude: ['password', 'username'] }
    });
    return admin;
  }

  async GetAllAdmin(sort = 'DESC', search?: string): Promise<Admin[]> {
    const admins = await this.adminModel.findAll({
      where: search ? sequelize.literal(`MATCH (name, email) AGAINST("${search}")`) : null,
      order: [['createdAt', sort]],
      attributes: { exclude: ['password'] }
    });
    return admins;
  }

  async GetAdminForAuth(username: string): Promise<Admin> {
    const admin = await this.adminModel.findOne({
      where: {
        [Op.or]: [
          {
            username: username
          },
          {
            email: username
          }
        ]
      }
    });
    return admin;
  }
}
