import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PointPart } from './point-part.entity';
import { PointPart_checkDto } from './point-part.dto/point-part_check.dto';

@Injectable()
export class PointPartService {
  constructor(
    @InjectModel(PointPart)
    private pointpartModel: typeof PointPart
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
}
