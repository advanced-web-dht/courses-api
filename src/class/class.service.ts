import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';

import { Class } from './class.entity';
import { ClassAccount, Role } from '../entities/class-account.entity';
import { Account } from '../account/account.entity';
import { createClassDto } from './class.dto/create-class.dto';
import { AccountLogin } from 'src/auth/auth.interface';
import { PointPart } from '../point-part/point-part.entity';
import { AccountService } from '../account/account.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class)
    private classModel: typeof Class,
    @InjectModel(ClassAccount)
    private classAccountModel: typeof ClassAccount,
    private readonly accountService: AccountService
  ) {}

  async CreateClass({ name }: createClassDto, account: AccountLogin): Promise<Class> {
    const code = nanoid(8);
    const classToAdd = {
      name,
      code
    };
    try {
      const newClass = await this.classModel.create(classToAdd);
      await this.AddMember(account.id, newClass.id, 'owner');
      newClass.setDataValue('isOwner', true);
      newClass.setDataValue('members', [{ name: account.name, id: account.id, detail: { role: 'owner' } }]);
      return newClass;
    } finally {
      // do nothing
    }
  }

  async getAll(userId: number): Promise<Class[]> {
    return await this.classModel.findAll({
      include: [
        {
          model: Account,
          through: {
            attributes: ['role'],
            as: 'detail'
          },
          attributes: ['name', 'id'],
          where: {
            id: userId
          }
        }
      ],
      attributes: ['id', 'name', 'code']
    });
  }

  async AddMember(AccountId: number, ClassId: number, role: Role): Promise<void> {
    const classToAdd = {
      accountId: AccountId,
      classId: ClassId,
      role: role
    };
    await this.classAccountModel.create(classToAdd);
  }

  async AddMemberFromFileToClass(member: Record<string, any>, classId: number): Promise<void> {
    member.forEach(async (items) => {
      console.log(items.studentId);
      const id = await this.accountService.getAccountbyStudentId(items.studentId);
      console.log(id);
      const classToAdd = {
        accountId: id,
        classId: classId,
        role: 'student'
      };
      await this.classAccountModel.create(classToAdd);
    });
  }

  async getClassByCode(code: string, accountId: number): Promise<Class> {
    try {
      const result = await this.classModel.findOne({
        include: [
          {
            model: Account,
            through: {
              as: 'detail',
              attributes: ['role']
            },
            attributes: ['name', 'id', 'studentId']
          },
          {
            model: PointPart,
            attributes: { exclude: ['dateCreated', 'dateUpdated'] }
          }
        ],
        order: [[{ model: PointPart, as: 'grades' }, 'order', 'ASC']],
        where: {
          code: code
        }
      });
      //Check is member
      const member = result.members.find((member) => member.id === accountId);
      console.log(member);
      if (member) {
        result.setDataValue('role', member.detail.role);
        return result;
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async getClassByCodeToEnroll(code: string): Promise<Class> {
    try {
      const result = await this.classModel.findOne({
        where: {
          code: code
        },
        include: [
          {
            model: Account,
            through: {
              where: {
                role: 'owner'
              },
              attributes: []
            },
            attributes: ['name']
          }
        ]
      });

      return result;
    } catch (err) {
      return null;
    }
  }

  async getMemberByRole(id: number, role: string): Promise<Account[]> {
    const result = await this.classModel.findOne({
      where: {
        id: id
      },
      include: [
        {
          model: Account,
          attributes: ['id', 'name'],
          through: {
            where: {
              role: role
            },
            attributes: []
          }
        }
      ]
    });
    return result.members;
  }
  async getListMemberwithStudentId(id: number): Promise<Account[]> {
    const result = await this.classModel.findOne({
      where: {
        id: id
      },
      include: [
        {
          model: Account,
          attributes: ['studentId', 'name'],
          through: {
            where: {
              classId: id
            },
            attributes: []
          }
        }
      ]
    });
    return result.members;
  }
}
