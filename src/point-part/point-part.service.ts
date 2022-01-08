import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PointPart } from './point-part.entity';
import { PointPart_checkDto } from './point-part.dto/point-part_check.dto';
import { promises } from 'dns';
import { Account } from '../account/account.entity';
import { Class } from '../class/class.entity';
import { Point } from '../point/point.entity';

@Injectable()
export class PointPartService {
  constructor(
    @InjectModel(PointPart)
    private pointpartModel: typeof PointPart,
    @InjectModel(Class)
    private classModel: typeof Class
  ) {}
  async addPointPart({ classId, name, ratio, order }: PointPart_checkDto): Promise<PointPart> {
    const info = {
      classId,
      name,
      ratio,
      order
    };
    const newPointPart = await this.pointpartModel.create(info);
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
  async GetPointPartWithListStudent(id: number, classId: number): Promise<Point[]> {
    const result = await this.pointpartModel.findOne({
      where: {
        id: id,
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
      ]
    });
    return result.points;
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
  async markDone(id: number): Promise<PointPart> {
    const line = await this.pointpartModel.findOne({ where: { id: id } });
    line.set({
      isDone: 1
    });
    await line.save();
    return line;
  }

  async GetAllPoint(gradeId: number): Promise<PointPart> {
    const result = await this.pointpartModel.findOne({
      where: {
        id: gradeId
      },
      include: [
        {
          model: Point,
          attributes: ['studentId', 'point']
        }
      ]
    });
    return result;
  }
}
