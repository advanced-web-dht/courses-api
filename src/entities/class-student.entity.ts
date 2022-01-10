import { Column, Model, Table, DataType, ForeignKey, BelongsTo, BelongsToMany, PrimaryKey } from 'sequelize-typescript';
import { Class } from '../class/class.entity';
import { Account } from '../account/account.entity';
import { Point } from '../point/point.entity';
import { PointPart } from '../point-part/point-part.entity';

@Table({ timestamps: false })
export class ClassStudent extends Model {
  @PrimaryKey
  @Column({ allowNull: false, autoIncrement: true })
  id: number;

  @Column({ allowNull: false, type: DataType.STRING(15), unique: 'class_student_pk' })
  studentId: string;

  @ForeignKey(() => Class)
  @Column({ unique: 'class_student_pk' })
  classId: number;

  @ForeignKey(() => Account)
  accountId: number;

  @Column({ type: DataType.STRING(50) })
  name: string;

  @BelongsTo(() => Account, 'accountId')
  account: Account;

  @BelongsTo(() => Class, 'classId')
  class: Class;

  @BelongsToMany(() => PointPart, () => Point, 'csId')
  grades: Array<PointPart & { detail: Point }>;
}
