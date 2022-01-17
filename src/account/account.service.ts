import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Op } from 'sequelize';

import { Account } from './account.entity';
import { ClassTeacher } from '../entities/class-teacher.entity';
import { UpdateAccountDto } from './account.dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account)
    private accountModel: typeof Account,
    @InjectModel(ClassTeacher)
    private classAccountModel: typeof ClassTeacher
  ) {}

  async findUser(username: string): Promise<Account> {
    const account = await this.accountModel.findOne({
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
    return account;
  }

  async getAccountByEmail(email: string): Promise<Account> {
    const account = await this.accountModel.findOne({ where: { email: email } });
    return account;
  }

  async getAccountById(id: number): Promise<Account> {
    const account = await this.accountModel.findOne({ where: { id }, attributes: { exclude: ['password'] } });
    return account;
  }

  async createAccountGoogle(name: string, email: string): Promise<Account> {
    const info = {
      name,
      email
    };
    const newAccount = await this.accountModel.create(info);
    return newAccount;
  }

  async createAccount(name: string, email: string, password: string, username: string): Promise<Account> {
    const info = {
      name,
      email,
      password,
      username
    };
    const newAccount = await this.accountModel.create(info);
    return newAccount;
  }

  async checkEmailExisted(email: string): Promise<boolean> {
    try {
      const account = await this.accountModel.findOne({ where: { email: email } });
      if (account) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  async checkUsernameExisted(username: string): Promise<boolean> {
    try {
      const account = await this.accountModel.findOne({ where: { username: username } });
      if (account) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  async getAccountByStudentId(studentId: string): Promise<number> {
    const user = await this.accountModel.findOne({ where: { studentId: studentId } });
    return user.id;
  }

  async UpdateAccount(id: number, User: UpdateAccountDto): Promise<Account> {
    const user = await this.accountModel.findOne({ where: { id: id } });
    user.set({
      name: User.name,
      studentId: User.studentId
    });
    await user.save();
    return user;
  }

  async AddMemberFromFileToAccount(member: Record<string, any>): Promise<void> {
    member.forEach(async (items) => {
      const classToAdd = {
        name: items.name,
        studentId: items.studentId
      };
      await this.accountModel.create(classToAdd);
    });
  }

  async UpdateAccountStatus(status: string, email?: string, id?: number): Promise<boolean> {
    const target = await this.accountModel.findOne({ where: { [Op.or]: [{ email: email || null }, { id: id || null }] } });
    if (target) {
      target.set('status', status);
      await target.save();
      return true;
    } else {
      return false;
    }
  }

  async UpdatePassword(email: string, password: string): Promise<boolean> {
    const target = await this.accountModel.findOne({ where: { email } });
    if (target) {
      target.set('password', password);
      await target.save();
      return true;
    } else {
      return false;
    }
  }

  async GetAllAccount(sort = 'DESC', search?: string): Promise<Account[]> {
    const accounts = await this.accountModel.findAll({
      where: search ? sequelize.literal(`MATCH (name, email) AGAINST("${search}")`) : null,
      order: [['createdAt', sort]],
      attributes: { exclude: ['password'] }
    });
    return accounts;
  }

  async UpdateStudentId(id: number, studentId?: string): Promise<boolean> {
    const user = await this.accountModel.findOne({ where: { id: id } });
    if (user) {
      if (studentId) {
        user.set({ studentId });
      } else {
        user.set('studentId', null);
      }
      await user.save();
      return true;
    }
    return false;
  }
}
