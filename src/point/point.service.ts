import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Point } from './point.entity';
import { AccountService } from '../account/account.service';
import { Point_checkDto } from './point.dto/point_check.dto';
import { Account } from '../account/account.entity';
import { PointPart } from '../point-part/point-part.entity';

@Injectable()
export class PointService {
  constructor(
    @InjectModel(Point)
    private pointModel: typeof Point,
    private readonly accountService: AccountService
  ) {}
  async addPointFromFile({ point, classId, pointpartId }: Point_checkDto): Promise<void> {
    point.forEach(async (items) => {
      const id = await this.accountService.getAccountbyStudentId(items.studentId);
      const info = {
        classId: classId,
        accountId: id,
        point: items.point as number,
        pointPartId: pointpartId
      };
      await this.pointModel.create(info);
    });
  }
  async addPoint({ point, classId, pointpartId, studentId }): Promise<void> {
    const id = await this.accountService.getAccountbyStudentId(studentId);
    const info = {
      classId: classId,
      accountId: id,
      point: point as number,
      pointPartId: pointpartId
    };
    await this.pointModel.create(info);
  }
}
