import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { nanoid } from 'nanoid';
import sequelize, { Op } from 'sequelize';

import { Class } from './class.entity';
import { ClassTeacher, Role } from '../entities/class-teacher.entity';
import { ClassStudent } from '../entities/class-student.entity';
import { Account } from '../account/account.entity';
import { createClassDto } from './class.dto/create-class.dto';
import { AccountLogin } from 'src/auth/auth.interface';
import { PointPart } from '../point-part/point-part.entity';
import { Point } from '../point/point.entity';
import * as helper from './class.helper';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class)
    private classModel: typeof Class,
    @InjectModel(ClassTeacher)
    private classTeacher: typeof ClassTeacher,
    @InjectModel(ClassStudent)
    private classStudent: typeof ClassStudent
  ) {}

  async CreateClass({ name }: createClassDto, account: AccountLogin): Promise<Class> {
    const code = nanoid(8);
    const classToAdd = {
      name,
      code,
      ownerId: account.id
    };
    try {
      const newClass = await this.classModel.create(classToAdd);
      newClass.setDataValue('owner', { ownerId: account.id });
      return newClass;
    } finally {
      // do nothing
    }
  }

  async getAll(userId: number): Promise<Class[]> {
    const raw = await this.classModel.findAll({
      include: [
        {
          model: Account,
          as: 'teachers'
        },
        {
          model: Account,
          as: 'owner'
        },
        {
          model: ClassStudent,
          include: [
            {
              model: Account
            }
          ]
        }
      ],
      attributes: ['id', 'name', 'code'],
      where: {
        [Op.or]: [
          { '$students.accountId$': userId },
          {
            '$teachers.id$': userId
          },
          {
            ownerId: userId
          }
        ]
      }
    });

    // Check role
    const result = raw.map((cls) => {
      this.SetRoleForResult(cls, userId);
      return cls;
    });
    return result;
  }

  async AddMember(AccountId: number, ClassId: number, role: Role): Promise<void> {
    const classToAdd = {
      accountId: AccountId,
      classId: ClassId,
      role: role
    };
    await this.classTeacher.create(classToAdd);
  }

  async AddStudent(accountId: number, classId: number, studentId: string, name: string): Promise<void> {
    const student = await this.classStudent.findOne({ where: { studentId, classId } });
    if (!student) {
      await this.classStudent.create({ accountId, classId, studentId, name });
      return;
    }
    if (student.accountId) {
      return;
    } else {
      // Map account
      student.set('accountId', accountId);
      await student.save();
    }
  }

  async AddTeacher(AccountId: number, ClassId: number): Promise<void> {
    const classToAdd = {
      accountId: AccountId,
      classId: ClassId
    };
    await this.classTeacher.create(classToAdd);
  }

  async AddStudentList(students: Record<string, string | number>[], classId: number): Promise<void> {
    const studentsToAdd = students.map((student) => {
      student.classId = classId;
      return student;
    });
    this.classStudent.bulkCreate(studentsToAdd, { updateOnDuplicate: ['name'] });
  }

  async getClassByCode(code: string, accountId: number): Promise<Class> {
    try {
      const result = await this.classModel.findOne({
        include: [
          {
            model: Account,
            as: 'teachers',
            attributes: ['name', 'id', 'studentId']
          },
          {
            model: Account,
            as: 'owner',
            attributes: ['name', 'id']
          },
          {
            model: ClassStudent,
            include: [
              {
                model: Account
              }
            ]
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
      const teacher = result.teachers.find((member) => member.id === accountId);
      const student = result.students.find((member) => member.accountId === accountId);
      if (teacher || student || result.owner.id === accountId) {
        this.SetRoleForResult(result, accountId);
        return result;
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async getClassById(classId: number, accountId: number): Promise<Class> {
    try {
      const result = await this.classModel.findOne({
        include: [
          {
            model: Account,
            as: 'teachers',
            attributes: ['name', 'id', 'studentId']
          },
          {
            model: Account,
            as: 'owner',
            attributes: ['name', 'id']
          },
          {
            model: ClassStudent
          },
          {
            model: PointPart,
            attributes: { exclude: ['dateCreated', 'dateUpdated'] }
          }
        ],
        order: [[{ model: PointPart, as: 'grades' }, 'order', 'ASC']],
        where: {
          id: classId,
          [Op.or]: [
            { '$students.accountId$': accountId },
            {
              '$teachers.id$': accountId
            },
            {
              ownerId: accountId
            }
          ]
        }
      });
      if (result) {
        this.SetRoleForResult(result, accountId);
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
            as: 'owner',
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
    return result.teachers;
  }
  async GetListMemberWithStudentId(id: number): Promise<Account[]> {
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
    return result.teachers;
  }

  SetRoleForResult(cls: Class, userId: number): void {
    if (cls.owner?.id === userId) {
      cls.setDataValue('role', 'owner');
    }

    const teacherIndex = cls.teachers.findIndex((teacher) => teacher.id === userId);
    if (teacherIndex != -1) {
      cls.setDataValue('role', 'teacher');
    }

    const studentIndex = cls.students.findIndex((student) => student.accountId === userId);
    if (studentIndex != -1) {
      cls.setDataValue('role', 'student');
    }
  }

  async GetRole(accountId: number, classId: number): Promise<string> {
    const cls = await this.getClassById(classId, accountId);
    return cls.getDataValue('role');
  }

  async GetAllGrade(classId: number): Promise<Class> {
    const cls = await this.classModel.findOne({
      include: [
        {
          model: ClassStudent,
          include: [
            {
              model: Account,
              attributes: ['name', 'id', 'email']
            },
            {
              model: PointPart,
              attributes: { exclude: ['createdAt', 'updatedAt'] },
              through: {
                as: 'detail',
                attributes: { exclude: ['createdAt', 'updatedAt'] }
              }
            }
          ]
        },
        {
          model: PointPart
        }
      ],
      order: [
        [{ model: ClassStudent, as: 'students' }, { model: PointPart, as: 'grades' }, 'order', 'ASC'],
        [{ model: PointPart, as: 'grades' }, 'order', 'ASC']
      ],
      where: { id: classId },
      attributes: ['id', 'name', 'code']
    });
    const ratioSum = helper.CalculateSumOfRatio(cls.grades);
    cls.students.forEach((student) => {
      const finalScore = helper.CalculateFinalGrade(student.grades, ratioSum);
      if (finalScore) {
        student.setDataValue('final', finalScore);
      } else {
        student.setDataValue('final', 0);
      }
    });
    return cls;
  }

  async GetStudentById(classId: number, studentId: string): Promise<ClassStudent> {
    const student = await this.classStudent.findOne({ where: { classId, studentId } });
    return student;
  }

  async GetTeachersOfClass(classId: number): Promise<Class> {
    const target = await this.classModel.findOne({
      where: { id: classId },
      include: [{ model: Account, as: 'teachers', attributes: ['id'] }],
      attributes: ['ownerId']
    });
    return target;
  }
}
