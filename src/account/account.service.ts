import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Account } from './account.entity';
import { ClassAccount } from '../entities/class-account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account)
    private accountModel: typeof Account,
    @InjectModel(ClassAccount)
    private classAccountModel: typeof ClassAccount
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

  async getAccountbyStudentId(studentId: string): Promise<number> {
    const user = await this.accountModel.findOne({ where: { studentId: studentId } });
    return user.id;
  }

  async UpdateAccount(id: number, User: any): Promise<Account> {
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
}
