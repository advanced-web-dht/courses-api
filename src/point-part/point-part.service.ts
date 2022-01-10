import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { PointPart } from './point-part.entity';
import { PointPart_checkDto } from './point-part.dto/point-part_check.dto';
import { Account } from '../account/account.entity';
import { Point } from '../point/point.entity';
import { ClassStudent } from '../entities/class-student.entity';
import { PointService } from '../point/point.service';
import { CalculateFinalGrade } from '../class/class.helper';
import sequelize, { Op } from 'sequelize';

@Injectable()
export class PointPartService {
  constructor(
    @InjectModel(PointPart)
    private pointpartModel: typeof PointPart,
    @InjectModel(ClassStudent)
    private classStudentModel: typeof ClassStudent,
    private readonly pointService: PointService
  ) {}
  async addPointPart({ classId, name, ratio, order }: PointPart_checkDto): Promise<PointPart> {
    const info = {
      classId,
      name,
      ratio,
      order
    };
    const newPointPart = await this.pointpartModel.create(info);
    const result = await this.classStudentModel.findAll({ where: { classId } });
    const points = result.map((student) => ({ point: 0, studentId: student.studentId }));
    await this.pointService.AddPointList({ points, classId, pointpartId: newPointPart.id });
    return newPointPart;
  }
  async getPointStructure(classId: string): Promise<PointPart[]> {
    const point_structure = await this.pointpartModel.findAll({
      where: {
        classID: classId
      },
      order: [['order', 'ASC']],
      attributes: ['name', 'ratio', 'id']
    });
    return point_structure;
  }
  async UpdatePointPart({ id, name, ratio }): Promise<PointPart> {
    const line = await this.pointpartModel.findOne({ where: { id: id } });
    line.set({
      name: name,
      ratio: ratio
    });
    await line.save();
    return line;
  }

  async UpdateOrder(order: Record<string, number>[]): Promise<void> {
    // order.forEach(async (items) => {
    // 	await this.pointpartModel.update(
    // 		{ order: items.order as number },
    // 		{
    // 			where: {
    // 				id: items.id
    // 			}
    // 		}
    // 	);
    // });
    const query = order.map((item) => {
      this.pointpartModel.update(
        { order: item.order as number },
        {
          where: {
            id: item.id
          }
        }
      );
    });
    await Promise.all(query);
  }
  // async GetPointPartWithListStudent(id: number, classId: number): Promise<Point[]> {
  //   const result = await this.pointpartModel.findOne({
  //     where: {
  //       id: id,
  //       classId: classId
  //     },
  //     include: [
  //       {
  //         model: Point,
  //         include: [
  //           {
  //             model: Account,
  //             attributes: ['studentId']
  //           }
  //         ],
  //         attributes: ['point']
  //       }
  //     ]
  //   });
  //   return result.points;
  // }

  async GetAllWithListStudent(classId: number): Promise<PointPart[]> {
    const result = await this.pointpartModel.findAll({
      where: {
        classId: classId
      },
      include: [
        {
          model: Point,
          include: [
            {
              model: Account,
              attributes: ['studentId']
            }
          ],
          attributes: ['point']
        }
      ],
      attributes: ['id', 'name', 'ratio']
    });
    return result;
  }
  async UpdateStatus(id: number, value: boolean): Promise<void> {
    await this.pointpartModel.update({ isDone: value }, { where: { id } });
  }

  async GetAllPoint(gradeId: number): Promise<PointPart> {
    const result = await this.pointpartModel.findOne({
      where: {
        id: gradeId
      },
      include: [
        {
          model: ClassStudent,
          through: {
            as: 'detail'
          }
        }
      ]
    });
    return result;
  }

  async GetAllPointsOfStudentOfClass(studentId: string, classId: number): Promise<ClassStudent> {
    const result = await this.classStudentModel.findOne({
      where: { studentId, classId },
      include: [
        {
          model: PointPart,
          where: { classId },
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          through: {
            as: 'detail',
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          }
        }
      ]
    });

    result.grades.forEach((grade) => {
      if (!grade.isDone) {
        grade.detail.point = 0;
      }
    });
    const ratioSum = result.grades.reduce((a, b) => a + b.ratio, 0);
    const finalScore = CalculateFinalGrade(result.grades, ratioSum);
    result.setDataValue('final', finalScore);
    return result;
  }
}
