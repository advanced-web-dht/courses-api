import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { PointPart } from './point-part.entity';
import { PointPart_checkDto } from './point-part.dto/point-part_check.dto';
import { Account } from '../account/account.entity';
import { Point } from '../point/point.entity';
import { ClassStudent } from '../entities/class-student.entity';
import { CalculateFinalGrade } from '../class/class.helper';
import { PointService } from '../point/point.service';
import { Review } from '../review/review.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DoneEvent } from './point-part.event/mark-grade-done.event';
import { UpdatePointPartDTO } from './point-part.dto/update-pointpart.dto';

@Injectable()
export class PointPartService {
  constructor(
    @InjectModel(PointPart)
    private pointpartModel: typeof PointPart,
    @InjectModel(ClassStudent)
    private classStudentModel: typeof ClassStudent,
    private readonly pointService: PointService,
    private eventEmitter: EventEmitter2
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
    const points = result.map((student) => ({ point: 0, csId: student.id }));
    await this.pointService.AddPointList({ points, classId, pointPartId: newPointPart.id });
    return newPointPart;
  }
  async getPointStructure(classId: string): Promise<PointPart[]> {
    const pointStructure = await this.pointpartModel.findAll({
      where: {
        classID: classId
      },
      order: [['order', 'ASC']],
      attributes: ['name', 'ratio', 'id']
    });
    return pointStructure;
  }

  async UpdatePointPart({ name, ratio }: UpdatePointPartDTO, id: number): Promise<PointPart> {
    const line = await this.pointpartModel.findOne({ where: { id: id } });
    line.set({
      name: name,
      ratio: ratio
    });
    await line.save();
    return line;
  }

  async UpdateOrder(order: Record<string, number>[]): Promise<void> {
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
    const target = await this.pointpartModel.findOne({ where: { id } });
    target.set({ isDone: value });
    await target.save();
    if (value) {
      const doneEvent: DoneEvent = {
        classId: target.classId,
        message: `C???t ??i???m ${target.name} ???? ho??n th??nh. B???n c?? th??? xem tr??n ph???n ??i???m s??? c???a m??nh!!`,
        topic: '??i???m'
      };
      this.eventEmitter.emit('point-part.done', doneEvent);
    }
  }

  async GetAllPoints(gradeId: number): Promise<Array<ClassStudent & { detail: Point }>> {
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
    return result.students;
  }

  async GetAllPointsOfStudentOfClass(studentId: string, classId: number): Promise<ClassStudent> {
    const result = await this.classStudentModel.findOne({
      where: { studentId, classId },
      include: [
        {
          model: PointPart,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          through: {
            as: 'detail',
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          }
        }
      ],
      order: [[{ model: PointPart, as: 'grades' }, 'order', 'ASC']]
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

  async GetDoneGradeOfClass(classId: number): Promise<PointPart[]> {
    const result = await this.pointpartModel.findAll({
      where: { classId, isDone: true },
      include: [
        {
          model: Review,
          attributes: ['id']
        }
      ],
      order: [['order', 'ASC']]
    });
    return result;
  }

  async DeletePointPart(id: number): Promise<void> {
    await this.pointpartModel.destroy({ where: { id } });
  }
}
