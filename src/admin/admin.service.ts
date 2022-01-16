import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './admin.entity';
import { CreateAdminDto } from './admin.dto/create-admin.dto';
import { Op } from 'sequelize';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin)
    private readonly adminModel: typeof Admin
  ) {}

  async CreateAdminAccount(payload: CreateAdminDto, creatorId?: string): Promise<boolean> {
    try {
      const newAdmin = {
        ...payload,
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
      include: [{ model: Admin, attributes: ['id', 'name'] }],
      attributes: { exclude: ['password', 'username'] }
    });
    return admin;
  }

  async GetAllAdmin(): Promise<Admin[]> {
    const admins = await this.adminModel.findAll({
      attributes: { exclude: ['password', 'username'] }
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
