import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Point } from './point.entity';
import { AccountService } from '../account/account.service';
import { AddPointListDto } from './point.dto/add-points.dto';

@Injectable()
export class PointService {
  constructor(
    @InjectModel(Point)
    private pointModel: typeof Point,
    private readonly accountService: AccountService
  ) {}

  async AddPointList({ points, classId, pointpartId }: AddPointListDto): Promise<void> {
    const pointListToAdd = points.map((point) => ({ ...point, classId, pointPartId: pointpartId }));
    console.log(pointListToAdd);
    await this.pointModel.bulkCreate(pointListToAdd, { updateOnDuplicate: ['point'] });
  }

  async AddPoint({ point, classId, pointpartId, studentId }): Promise<void> {
    const id = await this.accountService.getAccountByStudentId(studentId);
    const info = {
      classId: classId,
      accountId: id,
      point: point as number,
      pointPartId: pointpartId
    };
    await this.pointModel.create(info);
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
