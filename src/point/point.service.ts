import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Point } from './point.entity';
import { AddPointListDto } from './point.dto/add-points.dto';

@Injectable()
export class PointService {
  constructor(
    @InjectModel(Point)
    private pointModel: typeof Point
  ) {}

  async AddPointList({ points, classId, pointPartId }: AddPointListDto): Promise<void> {
    const pointListToAdd = points.map((point) => ({ ...point, classId, pointPartId }));

    await this.pointModel.bulkCreate(pointListToAdd, { updateOnDuplicate: ['point'] });
  }

  async UpdatePoint(csId: number, pointPartId: number, point: number): Promise<void> {
    await this.pointModel.update(
      { point },
      {
        where: { csId, pointPartId }
      }
    );
  }
}
