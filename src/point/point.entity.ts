import { Column, Model, Table, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import { Class } from '../class/class.entity';
import { PointPart } from '../point-part/point-part.entity';
import { ClassStudent } from '../entities/class-student.entity';

@Table
export class Point extends Model {
  @ForeignKey(() => Class)
  @Column({ allowNull: false, primaryKey: true })
  classId: number;

  @BelongsTo(() => Class)
  class: Class;

  @ForeignKey(() => ClassStudent)
  @Column({ allowNull: false, type: DataType.STRING(15), primaryKey: true })
  studentId: string;

  @BelongsTo(() => ClassStudent, 'studentId')
  student: ClassStudent;

  @ForeignKey(() => PointPart)
  @Column({ allowNull: false, primaryKey: true })
  pointPartId: number;

  @BelongsTo(() => PointPart)
  pointPart: PointPart;

  @Column({ allowNull: false })
  point: number;
}
