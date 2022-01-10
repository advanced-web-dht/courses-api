import { Column, Model, Table, DataType, ForeignKey, BelongsTo, PrimaryKey, BelongsToMany } from 'sequelize-typescript';
import { Class } from '../class/class.entity';
import { Account } from '../account/account.entity';
import { Point } from '../point/point.entity';
import { PointPart } from '../point-part/point-part.entity';

@Table({ timestamps: false })
export class ClassStudent extends Model {
  @PrimaryKey
  @Column({ allowNull: false, type: DataType.STRING(15) })
  studentId: string;

  @PrimaryKey
  @ForeignKey(() => Class)
  @Column
  classId: number;

  @ForeignKey(() => Account)
  accountId: number;

  @Column({ type: DataType.STRING(50) })
  name: string;

  @BelongsTo(() => Account, 'accountId')
  account: Account;

  @BelongsTo(() => Class, 'classId')
  class: Class;

  @BelongsToMany(() => PointPart, () => Point, 'studentId')
  grades: Array<PointPart & { detail: Point }>;
}
