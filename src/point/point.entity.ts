import { Column, Model, Table, ForeignKey, DataType, PrimaryKey } from 'sequelize-typescript';
import { PointPart } from '../point-part/point-part.entity';
import { ClassStudent } from '../entities/class-student.entity';

@Table
export class Point extends Model {
  @PrimaryKey
  @ForeignKey(() => ClassStudent)
  @Column({ allowNull: false })
  csId: number;

  @PrimaryKey
  @ForeignKey(() => PointPart)
  @Column({ allowNull: false })
  pointPartId: number;

  @Column({ allowNull: false, type: DataType.FLOAT })
  point: number;
}
