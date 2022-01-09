import { Column, Model, Table, BelongsTo, ForeignKey, DataType, PrimaryKey } from 'sequelize-typescript';
import { Class } from '../class/class.entity';
import { PointPart } from '../point-part/point-part.entity';
import { ClassStudent } from '../entities/class-student.entity';
import { Op } from 'sequelize';

@Table
export class Point extends Model {
  @ForeignKey(() => ClassStudent)
  @Column({ allowNull: false, type: DataType.STRING(15), primaryKey: true })
  studentId: string;

  @Column({ allowNull: false, primaryKey: true })
  classId: number;

  @PrimaryKey
  @ForeignKey(() => PointPart)
  @Column({ allowNull: false })
  pointPartId: number;

  @Column({ allowNull: false })
  point: number;
}
